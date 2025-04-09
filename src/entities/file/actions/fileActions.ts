'use server';

import { FileMetadata } from "@/entities/file/types/metadata";
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { jwtService } from "@/shared/lib/jwtService";
import { cookies } from "next/headers";
import path from 'path';
import { FileTree } from "@/shared/lib/fileTree";
import archiver from 'archiver';
import s3Client from "@/shared/lib/s3/s3-config";
import { PutObjectCommandInput, GetObjectCommandInput, DeleteObjectCommandInput } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
const METADATA_PATH = path.join(process.cwd(), 'storage/metadata');

async function addRootMetadata(metadataId: string, userId: number){
    const rootPath = path.join(METADATA_PATH, userId.toString());
    const rootFilePath = path.join(rootPath, 'root.json');

    try {
        await fs.access(rootFilePath);
    } catch {
        await fs.mkdir(rootPath, { recursive: true });

        const rootMetadata: FileMetadata = {
            id: 'root',
            name: 'root',
            parentId: null,
            type: 'folder',
            children: [metadataId],
            accessUsersRead: [userId],
            accessUsersWrite: [userId],
            ownerId: userId
        };

        await fs.writeFile(rootFilePath, JSON.stringify(rootMetadata));
        return;
    }

    const rootData = await fs.readFile(rootFilePath, 'utf-8');
    const rootMetadata = JSON.parse(rootData) as FileMetadata;
    if (rootMetadata.type === 'folder') {
        rootMetadata.children.push(metadataId);
        await fs.writeFile(rootFilePath, JSON.stringify(rootMetadata));
    }   
}

async function deleteFromRootMetadata(metadataId: string){
    const metadata = await getMetadata(metadataId);
    if('error' in metadata){
        return metadata;
    }
    const rootMetadata = await getRootMetadata(metadata.ownerId);
    if('error' in rootMetadata){
        return rootMetadata;
    }
    if(rootMetadata.type === 'folder'){
        rootMetadata.children = rootMetadata.children.filter(id => id !== metadataId);
        const rootPath = path.join(METADATA_PATH, metadata.ownerId.toString());
        const rootFilePath = path.join(rootPath, 'root.json');
        await fs.writeFile(rootFilePath, JSON.stringify(rootMetadata));
    } else {
        return {
            error: 'Родительская папка не найдена'
        };
    }
}

async function getRootMetadata(userId: number){
    const rootPath = path.join(METADATA_PATH, userId.toString());
    const rootFilePath = path.join(rootPath, 'root.json');

    try {
        await fs.access(rootFilePath);
    } catch {
        const rootMetadata: FileMetadata = {
            id: 'root',
            name: 'root',
            parentId: null,
            type: 'folder',
            children: [],
            accessUsersRead: [],
            accessUsersWrite: [],
            ownerId: userId
        }

        await fs.mkdir(rootPath, { recursive: true });

        await fs.writeFile(rootFilePath, JSON.stringify(rootMetadata));
        return rootMetadata;
    }

    const rootData = await fs.readFile(rootFilePath, 'utf-8');
    const rootMetadata = JSON.parse(rootData) as FileMetadata;

    return rootMetadata;
}

async function uploadFileOnDisk(file: File){
    try{
        const fileId = uuidv4();

        // Преобразуем File в Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        const params: PutObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileId,
            Body: buffer,
            ContentLength: buffer.length
        }

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return fileId;
    } catch (error) {
        console.error(error);
        return {
            error: 'Произошла ошибка при загрузке файла'
        };
    }

    // await ensureDirectoriesExist();
    
    // const fileId = uuidv4();
    // const filePath = path.join(FILES_PATH, fileId);

    // const buffer = await file.arrayBuffer();
    // const data = Buffer.from(buffer);

    // await fs.writeFile(filePath, data);

    // return fileId;
}

async function uploadFileAndCreateMetadata(
    file: File,
    parentId: string | null, 
    accessUsersRead: number[],
    accessUsersWrite: number[],
    ownerId: number
){
    const fileId = await uploadFileOnDisk(file);

    if(typeof fileId === 'object'){
        console.error(fileId);
        throw new Error('Произошла ошибка при загрузке файла', {cause: fileId});
    }

    const metadata: FileMetadata = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        parentId,
        type: 'file',
        fileId,
        accessUsersRead,
        accessUsersWrite,
        ownerId
    }

    await fs.writeFile(`${METADATA_PATH}/${metadata.id}.json`, JSON.stringify(metadata));    

    return metadata;
}

async function addChildToMetadata(parentId: string, childId: string){
    const parentMetadata = await getMetadata(parentId);
    if('error' in parentMetadata){
        return parentMetadata;
    }
    if(parentMetadata.type === 'folder'){
        parentMetadata.children.push(childId);
        await fs.writeFile(`${METADATA_PATH}/${parentMetadata.id}.json`, JSON.stringify(parentMetadata));
    } else {
        return {
            error: 'Родительская папка не найдена'
        };
    }
}

async function deleteChildFromMetadata(parentId: string, childId: string){
    const parentMetadata = await getMetadata(parentId);
    if('error' in parentMetadata){
        return parentMetadata;
    }
    if(parentMetadata.type === 'folder'){
        parentMetadata.children = parentMetadata.children.filter(id => id !== childId);
        await fs.writeFile(`${METADATA_PATH}/${parentMetadata.id}.json`, JSON.stringify(parentMetadata));
    } else {
        return {
            error: 'Родительская папка не найдена'
        };
    }
}

export type UploadFileParams = {
    file: File,
    parentId: string | null,
}

export async function uploadFile(params: UploadFileParams){
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if(!token){
            return {
                error: 'Вы не авторизованы'
            };
        }

        const decodedToken = jwtService.verifyToken(token.value);

        if(!decodedToken){
            return {
                error: 'Вы не авторизованы'
            };
        }

        const metadata = await uploadFileAndCreateMetadata(
            params.file,
            params.parentId,
            [decodedToken.id],
            [decodedToken.id],
            decodedToken.id
        );

        if(params.parentId && params.parentId !== 'root'){
            await addChildToMetadata(params.parentId, metadata.id);
        } else {
            await addRootMetadata(metadata.id, decodedToken.id);
        }

        return metadata;
    } catch (error) {
        console.error(error);
        return {
            error: 'Произошла ошибка при загрузке файла'
        };
    }
}

async function deleteFile(metadata: FileMetadata){
    if(metadata.type === 'file'){
        // delete file from s3
        const params: DeleteObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: metadata.fileId
        }

        await s3Client.send(new DeleteObjectCommand(params));

        if(metadata.parentId && metadata.parentId !== 'root'){
            await deleteChildFromMetadata(metadata.parentId, metadata.id);
        } else {
            await deleteFromRootMetadata(metadata.id);
        }
        await fs.unlink(`${METADATA_PATH}/${metadata.id}.json`);
    } else {
        await recursiveDeleteFolder(metadata);
    }

}

async function recursiveDeleteFolder(metadata: FileMetadata){
    if(metadata.type === 'file'){
        await deleteFile(metadata);
    } else {
        for(const child of metadata.children){
            const childMetadata = await getMetadata(child);
            if('error' in childMetadata){
                continue;
            }
            await recursiveDeleteFolder(childMetadata);
        }
        await deleteFromRootMetadata(metadata.id);
        await fs.unlink(`${METADATA_PATH}/${metadata.id}.json`);
    }
}

export async function deleteFileAction(metadataId: string){
    const metadata = await getMetadata(metadataId);

    if('error' in metadata){
        return metadata;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if(!token){
        if(metadata.accessUsersWrite.length !== 0){
            return {
                error: 'Вы не авторизованы'
            };
        }
    } else {
        const decodedToken = jwtService.verifyToken(token.value);

        if(!decodedToken){
            return {
                error: 'Вы не авторизованы'
            };
        }

        if(!metadata.accessUsersWrite.includes(decodedToken.id)){
            return {
                error: 'У вас нет доступа к этому файлу'
            };
        }
    }

    await deleteFile(metadata);
}
export type CreateFolderParams = {
    name: string;
    parentId: string | null;
}

export async function createFolder(params: CreateFolderParams){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if(!token){
        return {
            error: 'Вы не авторизованы'
        };
    }

    const decodedToken = jwtService.verifyToken(token.value);

    if(!decodedToken){
        return {
            error: 'Вы не авторизованы'
        };
    }

    const metadataId = uuidv4();

    const metadata: FileMetadata = {
        id: metadataId,
        name: params.name,
        parentId: params.parentId,
        type: 'folder',
        accessUsersRead: [decodedToken.id],
        accessUsersWrite: [decodedToken.id],
        ownerId: decodedToken.id,
        children: []
    }

    await fs.writeFile(`${METADATA_PATH}/${metadataId}.json`, JSON.stringify(metadata));

    if(params.parentId && params.parentId !== 'root'){
        await addChildToMetadata(params.parentId, metadataId);
    } else {
        await addRootMetadata(metadataId, decodedToken.id);
    }


    return metadata;
}

export async function getMetadata(metadataId: string): Promise<FileMetadata | {error: string}>{
    const metadata = await fs.readFile(`${METADATA_PATH}/${metadataId}.json`, 'utf-8');

    if(!metadata){
        return {
            error: 'Файл не найден'
        };
    }

    const metadataObject: FileMetadata = JSON.parse(metadata);

    const cookieStore = await cookies();

    const token = cookieStore.get('token');

    if(!token){
        if(metadataObject.accessUsersRead.length === 0){
            return metadataObject;
        }
        return {
            error: 'Вы не авторизованы'
        };
    }

    const decodedToken = jwtService.verifyToken(token.value);

    if(!decodedToken){
        return {
            error: 'Вы не авторизованы'
        };
    }

    if(metadataObject.accessUsersRead.includes(decodedToken.id) || metadataObject.accessUsersRead.length === 0){
        return metadataObject;
    }

    return {
        error: 'У вас нет доступа к этому файлу'
    };
}

async function getFile(fileId: string){
    try{
        const params: GetObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileId
        }

        const command = new GetObjectCommand(params);
        const response = await s3Client.send(command);

        if(response.Body){
            return response.Body;
        }

        return {
            error: 'Файл не найден'
        };
    } catch (error) {
        console.error(error);
    }
    // const filePath = `${FILES_PATH}/${fileId}`;

    // const file = await fs.readFile(filePath);
    
    // if(!file){
    //     return {
    //         error: 'Файл не найден'
    //     };
    // }

    // return file;
}

export async function addAccessToFile(metadataId: string, accessUsers: number[], type: 'read' | 'write'){
    const metadata = await getMetadata(metadataId);

    if('error' in metadata){
        return metadata;
    }

    if(type === 'read'){
        metadata.accessUsersRead = [...metadata.accessUsersRead, ...accessUsers];
    } else {
        metadata.accessUsersWrite = [...metadata.accessUsersWrite, ...accessUsers];
        for(const user of accessUsers){
            if(!metadata.accessUsersRead.includes(user)){
                metadata.accessUsersRead.push(user);
            }
        }
    }

    await fs.writeFile(`${METADATA_PATH}/${metadataId}.json`, JSON.stringify(metadata));

    return metadata;
}

export async function makeAccessToFilePublic(metadataId: string, type: 'read' | 'write'){
    const metadata = await getMetadata(metadataId);

    if('error' in metadata){
        return metadata;
    }

    if(type === 'read'){
        metadata.accessUsersRead = [];
    } else {
        metadata.accessUsersWrite = [];
        metadata.accessUsersRead = [];
    }

    await fs.writeFile(`${METADATA_PATH}/${metadataId}.json`, JSON.stringify(metadata));

    return metadata;
}

export async function removeAccessFromFile(metadataId: string, accessUsers: number[], type: 'read' | 'write'){
    const metadata = await getMetadata(metadataId);

    if('error' in metadata){
        return metadata;
    }

    if(type === 'read'){
        metadata.accessUsersRead = metadata.accessUsersRead.filter((user: number) => !accessUsers.includes(user));
    } else {
        metadata.accessUsersWrite = metadata.accessUsersWrite.filter((user: number) => !accessUsers.includes(user));
    }

    await fs.writeFile(`${METADATA_PATH}/${metadataId}.json`, JSON.stringify(metadata));

    return metadata;
}

export async function getMyFiles(){
    const cookieStore = await cookies();

    const token = cookieStore.get('token');

    if(!token){
        return {
            error: 'Вы не авторизованы'
        };
    }

    const decodedToken = jwtService.verifyToken(token.value);
    
    if(!decodedToken){
        return {
            error: 'Вы не авторизованы'
        };
    }
    
    const rootMetadata = await getRootMetadata(decodedToken.id);

    if('error' in rootMetadata){
        return rootMetadata;
    }
    
    return rootMetadata;
}

export async function downloadFiles(tree: FileTree[]){
    const data: {file: Buffer<ArrayBufferLike>, path: string}[] = [];

    for(const node of tree){
        await getFileChildren(node, '', (file, path) => {
            data.push({file, path});
        });
    }

    console.log(data);

    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', reject);
        archive.on('data', (chunk) => {
            chunks.push(chunk);
        });
        archive.on('finish', () => {
            resolve(Buffer.concat(chunks));
        });
    
        for(const file of data){
            archive.append(file.file, {name: file.path});
        }
    
        archive.finalize();
    })


}

async function getFileChildren(tree: FileTree, curPath: string, addFile: (file: Buffer, path: string) => void){
    if(tree.type === 'file'){
        const file = await getFile(tree.fileId);
        if(!file || 'error' in file){
            return;
        }
        const chunks: Uint8Array[] = [];
        const stream = file as unknown as AsyncIterable<Uint8Array>;
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        addFile(buffer, path.join(curPath, tree.name));
        return;
    }
    for(const node of tree.children){
        const filePath = path.join(curPath, tree.name);
        if(node.type === 'file'){
            const file = await getFile(node.fileId);
            if(!file || 'error' in file){
                continue;
            }
            const chunks: Uint8Array[] = [];
            const stream = file as unknown as AsyncIterable<Uint8Array>;
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            addFile(buffer, path.join(filePath, node.name));
        } else {
            await getFileChildren(node, filePath, addFile);
        }
    }
}
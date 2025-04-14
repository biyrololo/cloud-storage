"use server";

import { Content } from '@/entities/file';
import { File as FileModel, Folder as FolderModel, User } from '@prisma/client';
import archiver from 'archiver';
import { GetObjectCommand } from '@aws-sdk/client-s3'
import s3Client from '@/shared/lib/s3/s3-config';
import { prisma } from '@/shared/lib/prisma';
import { getAccess } from '@/shared/lib/auth/checkAccess';
import { getMe } from '../auth/getMe';
import { getPath } from '@/shared/lib/getPath';

type AddDataFunc = (file: Buffer, path: string) => void;

export async function downloadFiles(contents: Content[]){
    const data: {file: Buffer<ArrayBufferLike>, path: string}[] = [];
    const addFile: AddDataFunc = (file, path) => {
        data.push({file, path});
    }
    for(const content of contents){
        await downloadFile(content, addFile);
    }
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

async function downloadFile(content: Content, addFile: AddDataFunc){
    const access = await getAccess(content);
    if(!access){
        return {
            error: 'You don\'t have access to this file'
        }
    }
    if('s3Key' in content){
        const file = await downloadFileFromS3(content);
        if(!file){
            return {
                error: 'File not found'
            }
        }
        const chunks: Uint8Array[] = [];
        const stream = file as unknown as AsyncIterable<Uint8Array>;
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        addFile(buffer, getPath(content.path, content.name));
        return;
    }
    const user = await getMe();
    await downloadFolder(content, user, addFile);
}

async function downloadFileFromS3(file: FileModel){
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key
    })
    const response = await s3Client.send(command);
    if(response.Body){
        return response.Body;
    }
    return null;
}

async function downloadFolder(folder: FolderModel, user: User | null, addFile: AddDataFunc){
    const email = user ? user.email : 'all';
    const allFiles = await prisma.file.findMany({
        where: {
            path: {
                startsWith: getPath(folder.path, folder.name)
            },
            ownerId: folder.ownerId,
            readAccess: {
                has: email
            }
        }
    })


    for(const file of allFiles){
        const fileData = await downloadFileFromS3(file);
        if(!fileData){
            continue;
        }
        const chunks: Uint8Array[] = [];
        const stream = fileData as unknown as AsyncIterable<Uint8Array>;
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        addFile(buffer, getPath(file.path, file.name));
    }


}
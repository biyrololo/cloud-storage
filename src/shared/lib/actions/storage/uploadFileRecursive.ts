"use server";

import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

import { getMe } from "../auth/getMe";
import { getPath } from "../../getPath";
import { getSize } from "../../size/getSize";
import { prisma } from "@/shared/lib/prisma";
import s3Client from "@/shared/lib/s3/s3-config";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileRecursive(uploadFile: File, path_: string, relativePath_: string){
    const relativePath = decodeURIComponent(relativePath_).split('/').slice(0,-1).join('/');
    const path = decodeURIComponent(path_);
    if(uploadFile.size > getSize('1000MB')){
        return {
            error: "File size is too large"
        }
    }
    
    const user = await getMe();
    if(!user){
        return {
            error: "User not found"
        }
    }

    if(BigInt(user.usedSpace) + BigInt(uploadFile.size) > user.maxSpace){
        return {
            error: "You don't have enough space"
        }
    }

    if(!path){
        const relativePathParts = relativePath.split('/');
        for(let i = 0; i < relativePathParts.length; i++){
            const _path = relativePathParts.slice(0, i).join('/');
            const candidate = await prisma.folder.findFirst({
                where: {
                    path: _path,
                    name: relativePathParts[i],
                    ownerId: user.id
                }
            })
        
            if(!candidate){
                await prisma.folder.create({
                    data: {
                        name: relativePathParts[i],
                        path: _path,
                        ownerId: user.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        readAccess: [user.email],
                        writeAccess: [user.email],
                    }
                })
            }
        }

        const candidate = await prisma.file.findFirst({
            where: {
                name: uploadFile.name,
                path: relativePath,
                ownerId: user.id
            }
        })
    
        if(candidate){
            return {
                error: "File already exists"
            }
        }

        const s3Key = uuidv4();
    
        const buffer = Buffer.from(await uploadFile.arrayBuffer());
    
        const params: PutObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: buffer,
            ContentLength: buffer.length
        }
    
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
    
        const file = await prisma.file.create({
            data: {
                name: uploadFile.name,
                path: relativePath,
                ownerId: user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                s3Key: s3Key,
                size: uploadFile.size,
                readAccess: [user.email],
                writeAccess: [user.email],
            }
        })
    
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                usedSpace: BigInt(user.usedSpace) + BigInt(uploadFile.size)
            }
        })
        return {
            success: "File uploaded successfully",
            file: file
        }
    }

    const pathParts = path.split('/');
    const folderPath = getPath(pathParts.slice(0, -1));
    const folderName = pathParts[pathParts.length - 1];

    const folder = await prisma.folder.findFirst({
        where: {
            path: folderPath,
            name: folderName,
            ownerId: user.id
        }
    })

    if(!folder){
        return {
            error: "Folder not found"
        }
    }

    if(!folder.writeAccess.includes(user.email)){
        return {
            error: "You don't have access to this folder"
        }
    }

    const relativePathParts = relativePath.split('/');
    for(let i = 0; i < relativePathParts.length; i++){
        const _path = relativePathParts.slice(0, i).join('/');
        const candidate = await prisma.folder.findFirst({
            where: {
                path: [folder.path, folder.name, _path].filter(Boolean).join('/'),
                name: relativePathParts[i],
                ownerId: folder.ownerId
            }
        })

        if(!candidate){
            await prisma.folder.create({
                data: {
                    name: relativePathParts[i],
                    path: [folder.path, folder.name, _path].filter(Boolean).join('/'),
                    ownerId: folder.ownerId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    readAccess: folder.readAccess,
                    writeAccess: folder.writeAccess,
                }
            })
        }
    }

    const candidate = await prisma.file.findFirst({
        where: {
            name: uploadFile.name,
            path: [path, relativePath].join('/'),
            ownerId: folder.ownerId
        }
    })

    if(candidate){
        return {
            error: "File already exists"
        }
    }

    const s3Key = uuidv4();
    
    const buffer = Buffer.from(await uploadFile.arrayBuffer());

    const params: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentLength: buffer.length
    }

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const file = await prisma.file.create({
        data: {
            name: uploadFile.name,
            path: [path, relativePath].join('/'),
            ownerId: folder.ownerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            s3Key: s3Key,
            size: uploadFile.size,
            readAccess: folder.readAccess,
            writeAccess: folder.writeAccess,
        }
    })

    const owner = await prisma.user.findUnique({
        where: {
            id: folder.ownerId
        }
    })
    
    if(!owner){
        return {
            error: "Owner not found"
        }
    }

    await prisma.user.update({
        where: {
            id: owner.id
        },
        data: {
            usedSpace: BigInt(owner.usedSpace) + BigInt(uploadFile.size)
        }
    })
    return {
        success: "File uploaded successfully",
        file: file
    }
}
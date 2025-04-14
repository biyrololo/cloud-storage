"use server";

import { getMe } from "../auth/getMe";
import { prisma } from "@/shared/lib/prisma";
import s3Client from "@/shared/lib/s3/s3-config";
import { PutObjectCommandInput, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getPath } from "../../getPath";

export async function uploadFile(uploadFile: File, path_: string){
    const path = path_.replace('%20', ' ');
    console.log(path);
    if(uploadFile.size > 1024 * 1024 * 1000){
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

    if(!path){
        const candidate = await prisma.file.findFirst({
            where: {
                name: uploadFile.name,
                path: '',
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
                path: '',
                ownerId: user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                s3Key: s3Key,
                size: uploadFile.size,
                readAccess: [user.email],
                writeAccess: [user.email],
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

    const candidate = await prisma.file.findFirst({
        where: {
            name: uploadFile.name,
            path: path,
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
            path: path,
            ownerId: folder.ownerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            s3Key: s3Key,
            size: uploadFile.size,
            readAccess: folder.readAccess,
            writeAccess: folder.writeAccess,
        }
    })

    return {
        success: "File uploaded successfully",
        file: file
    }
}
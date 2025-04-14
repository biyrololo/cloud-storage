"use server";

import { Content } from '@/entities/file';
import { File as FileModel, Folder as FolderModel, User } from '@prisma/client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import s3Client from '@/shared/lib/s3/s3-config';
import { prisma } from '@/shared/lib/prisma';
import { getAccess } from '@/shared/lib/auth/checkAccess';
import { getMe } from '../auth/getMe';
import { getPath } from '@/shared/lib/getPath';

export async function deleteFile(content: Content){
    const access = await getAccess(content, 'write');
    if(!access){
        return {
            error: 'You don\'t have access to this file'
        }
    }
    if('s3Key' in content){
        await deleteFileFromS3(content);
        return;
    }
    const user = await getMe();
    return await deleteFolder(content, user);
}

async function deleteFileFromS3(file: FileModel){
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key
    })
    await s3Client.send(command);
    await prisma.file.delete({
        where: {
            id: file.id
        }
    })
    const user = await prisma.user.findUnique({
        where: {
            id: file.ownerId
        }
    })
    if(!user){
        return false;
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            usedSpace: Math.max(user.usedSpace - file.size, 0)
        }
    })
    return true;
}

async function deleteFolder(folder: FolderModel, user: User | null){
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
        await deleteFileFromS3(file);
    }

    await prisma.file.deleteMany({
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
    
    await prisma.folder.deleteMany({
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

    await prisma.folder.delete({
        where: {
            id: folder.id
        }
    })
}
"use server";

import { Folder, User } from "@prisma/client";
import { getMe } from "../auth/getMe";
import { prisma } from "../../prisma";
import { getPath } from "@/shared/lib/getPath";

export async function makeFoldersPublic(folders: Folder[], access: 'read' | 'write'){
    const user = await getMe();
    if(!user){
        return {error: 'User not found'};
    }
    for(const folder of folders){
        await makeFolderPublic(folder, access, user);
    }
    return {success: true};
}

async function makeFolderPublic(folder: Folder, access: 'read' | 'write', user: User){
    if(!folder.writeAccess.includes('all') && !folder.writeAccess.includes(user.email)){
        return;
    }
    if(access === 'read'){
        await prisma.folder.update({
            where: {id: folder.id},
            data: {readAccess: ['all', user.email]}
        })
        await prisma.file.updateMany({
            where: {
                path: {
                    startsWith: getPath(folder.path, folder.name)
                },
                ownerId: folder.ownerId
            },
            data: {readAccess: ['all', user.email]}
        })
        await prisma.folder.updateMany({
            where: {
                path: {
                    startsWith: getPath(folder.path, folder.name)
                },
                ownerId: folder.ownerId
            },
            data: {readAccess: ['all', user.email]}
        })
    } else {
        await prisma.folder.update({
            where: {id: folder.id},
            data: {writeAccess: ['all', user.email]}
        })
        await prisma.file.updateMany({
            where: {
                path: {
                    startsWith: getPath(folder.path, folder.name)
                },
                ownerId: folder.ownerId
            },
            data: {writeAccess: ['all', user.email]}
        })
        await prisma.folder.updateMany({
            where: {
                path: {
                    startsWith: getPath(folder.path, folder.name)
                },
                ownerId: folder.ownerId
            },
            data: {writeAccess: ['all', user.email]}
        })
    }
}
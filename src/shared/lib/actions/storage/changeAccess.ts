"use server";

import { Folder, User } from "@prisma/client";
import { getMe } from "../auth/getMe";
import { prisma } from "../../prisma";
import { getPath } from "@/shared/lib/getPath";

export async function changeFoldersAccess(folders: Folder[], access: 'private' | 'public', accessType: 'read' | 'write'){
    const user = await getMe();
    if(!user){
        return {error: 'User not found'};
    }
    for(const folder of folders){
        await changeFolderAccess(folder, access, accessType, user);
    }
    return {success: true};
}

async function changeFolderAccess(folder: Folder, access: 'private' | 'public', accessType: 'read' | 'write', user: User){
    if(!folder.writeAccess.includes('all') && !folder.writeAccess.includes(user.email)){
        return;
    }
    let newReadAccess: string[] = folder.readAccess;
    let newWriteAccess: string[] = folder.writeAccess;
    if(accessType === 'read'){
        if(access === 'private'){
            newReadAccess = newReadAccess.filter(email => email !== 'all');
        } else {
            newReadAccess.push('all');
        }
    }  else {
        if(access === 'private'){
            newWriteAccess = newWriteAccess.filter(email => email !== 'all');
        } else {
            newWriteAccess.push('all');
        }
    }
    await prisma.folder.update({
        where: {id: folder.id},
        data: {readAccess: newReadAccess, writeAccess: newWriteAccess}
    })
    await prisma.file.updateMany({
        where: {
            path: {
                startsWith: getPath(folder.path, folder.name)
            },
            ownerId: folder.ownerId
        },
        data: {readAccess: newReadAccess, writeAccess: newWriteAccess}
    })
    await prisma.folder.updateMany({
        where: {
            path: {
                startsWith: getPath(folder.path, folder.name)
            },
            ownerId: folder.ownerId
        },
        data: {readAccess: newReadAccess, writeAccess: newWriteAccess}
    })
}
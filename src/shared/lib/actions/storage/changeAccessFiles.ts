"use server";

import { File as FileModel, User } from "@prisma/client";
import { getMe } from "../auth/getMe";
import { prisma } from "../../prisma";

export async function changeFilesAccess(files: FileModel[], access: 'private' | 'public', accessType: 'read' | 'write'){
    const user = await getMe();
    if(!user){
        return {error: 'User not found'};
    }
    for(const file of files){
        await changeFileAccess(file, access, accessType, user);
    }
    return {success: true};
}

async function changeFileAccess(file: FileModel, access: 'private' | 'public', accessType: 'read' | 'write', user: User){
    if(!file.writeAccess.includes('all') && !file.writeAccess.includes(user.email)){
        return;
    }
    let newReadAccess: string[] = file.readAccess;
    let newWriteAccess: string[] = file.writeAccess;
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
    await prisma.file.update({
        where: {id: file.id},
        data: {readAccess: newReadAccess, writeAccess: newWriteAccess}
    })
}
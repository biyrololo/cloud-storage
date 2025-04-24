"use server";

import { getMe } from "../auth/getMe";
import { prisma } from "@/shared/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createFolder(path_: string, _: any,  formData: FormData){
    const path = path_.replace('%20', ' ');
    const folderName = formData.get('folderName') as string;
    const rawValues = { folderName };

    if(!folderName){
        return {
            error: {
                folderName: "Folder name is required"
            },
            values: rawValues
        }
    }

    if(folderName.length > 255){
        return {
            error: {
                folderName: "Folder name is too long"
            },
            values: rawValues
        }
    }

    if(folderName.includes('/')){
        return {
            error: {
                folderName: "Folder name cannot contain slashes"
            },
            values: rawValues
        }
    }

    const user = await getMe();
    if(!user){
        return {
            error: {
                folderName: "User not found"
            },
            values: rawValues
        }
    }

    const candidate = await prisma.folder.findFirst({
        where: {
            name: folderName,
            path: path,
            ownerId: user.id
        }
    })

    if(candidate){
        return {
            error: {
                folderName: "Folder already exists"
            },
            values: rawValues
        }
    }

    const parentPath = path.split('/').slice(0, -1).join('/');
    const parentName = path.split('/').pop();

    if(!parentName){
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                path: '',
                ownerId: user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                readAccess: [user.email],
                writeAccess: [user.email],
            }
        })

        return {
            success: "Folder created successfully",
            folder: folder,
            values: rawValues
        }
    }

    const parentFolder = await prisma.folder.findFirst({
        where: {
            name: parentName,
            path: parentPath,
            ownerId: user.id
        }
    })

    if(!parentFolder){
        return {
            error: {
                folderName: "Path does not exist"
            },
            values: rawValues
        }
    }

    if(!parentFolder.writeAccess.includes(user.email)){
        return {
            error: {
                folderName: "You don't have access to this folder"
            },
            values: rawValues
        }
    }
    
    const folder = await prisma.folder.create({
        data: {
            name: folderName,
            path: path,
            ownerId: parentFolder.ownerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            readAccess: parentFolder.readAccess,
            writeAccess: parentFolder.writeAccess,
        }
    })

    return {
        success: "Folder created successfully",
        folder: folder,
        values: rawValues
    }
}
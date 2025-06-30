"use server";

import { getMe } from "./auth/getMe";
import { getPath } from "../getPath";
import { prisma } from "../prisma";

export async function getFolder(path: string, ownerId: number) {
    const user = await getMe();
    const findOptions = [
        {
            readAccess: {
                has: 'all'
            }
        }
    ]

    if(user) {
        findOptions.push({
            readAccess: {
                has: user.email
            }
        })
    }

    const pathParts = path.split('/');
    const folderName = pathParts[pathParts.length - 1];
    const parentPath = getPath(pathParts.slice(0, -1));

    const folder = await prisma.folder.findFirst({
        where: {
            path: parentPath,
            name: folderName,
            ownerId: ownerId,
            OR: findOptions
        }
    })

    return folder;
}
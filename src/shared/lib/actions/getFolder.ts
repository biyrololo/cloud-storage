"use server";

import { getTokenPayload } from "../auth/getTokenPayload";
import { prisma } from "../prisma";
import { getPath } from "../getPath";

export async function getFolder(path: string, ownerId: number) {
    const tokenPayload = await getTokenPayload();
    const findOptions = [
        {
            readAccess: {
                has: 'all'
            }
        }
    ]

    if(tokenPayload) {
        findOptions.push({
            readAccess: {
                has: tokenPayload.email
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
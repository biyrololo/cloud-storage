"use server";

import { getTokenPayload } from "../auth/getTokenPayload";
import { getPath } from "../getPath";
import { prisma } from "../prisma";
import { Content } from "@/entities/file/model";

export async function getContent(path: string, ownerId: number) {
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

    const files: Content[] = await prisma.file.findMany({
        where: {
            path: getPath(path),
            ownerId: ownerId,
            OR: findOptions
        }
    });

    const folders: Content[] = await prisma.folder.findMany({
        where: {
            path: getPath(path),
            ownerId: ownerId,
            OR: findOptions
        }
    });

    return [...files, ...folders];
}
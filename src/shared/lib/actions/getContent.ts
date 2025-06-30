"use server";

import { Content } from "@/entities/file/model";
import { getMe } from "./auth/getMe";
import { getPath } from "../getPath";
import { prisma } from "../prisma";

export async function getContent(path: string, ownerId: number) {
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
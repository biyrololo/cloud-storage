"use server";

import { getMe } from "./auth/getMe";
import { getPath } from "../getPath";
import { prisma } from "../prisma";

export async function getFiles(path: string) {
    const user = await getMe();
    
    const files = await prisma.file.findMany({
        where: {
            path: getPath(path),
            OR: [
                {
                    readAccess: {
                        has: user?.email
                    }
                },
                {
                    writeAccess: {
                        has: 'all'
                    }
                }
            ]
        }
    });

    return files;
}
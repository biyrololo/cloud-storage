"use server";

import { getTokenPayload } from "../auth/getTokenPayload";
import { prisma } from "../prisma";
import { getPath } from "../getPath";

export async function getFiles(path: string) {
    const tokenPayload = await getTokenPayload();
    
    const files = await prisma.file.findMany({
        where: {
            path: getPath(path),
            OR: [
                {
                    readAccess: {
                        has: tokenPayload?.email
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
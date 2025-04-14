"use server"

import { prisma } from "@/shared/lib/prisma";
import { getTokenPayload } from "@/shared/lib/auth/getTokenPayload";

export async function getMe() {
    const tokenPayload = await getTokenPayload();

    if(!tokenPayload) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: tokenPayload.id,
        },
    });

    if(!user) {
        return null;
    }

    return user;
}
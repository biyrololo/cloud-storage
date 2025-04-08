"use server";

import { cookies } from "next/headers";
import { jwtService } from "@/shared/lib/jwtService";
import { prisma } from "@/shared/lib/prisma";

export async function findMe(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if(!token){
        return null;
    }

    const decodedToken = jwtService.verifyToken(token.value);

    if(!decodedToken){
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return user;
}
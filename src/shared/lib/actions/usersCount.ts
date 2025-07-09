'use server'

import { prisma } from "../prisma";

export async function getUsersCount() {
    const users = await prisma.user.count();
    return users;
}
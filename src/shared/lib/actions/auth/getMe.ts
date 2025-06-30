import { getServerSession } from "next-auth";
import { prisma } from "@/shared/lib/prisma";

export async function getMe() {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    return user;
}
import { getServerSession } from "next-auth";
import { prisma } from "@/shared/lib/prisma";

export async function getMe() {
    const session = await getServerSession();
    if(!session?.user?.email) return null;
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    return user;
}
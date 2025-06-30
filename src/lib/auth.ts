import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/shared/lib/prisma";

export const authConfig: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user, profile }) {
            if(!user.email) return false;

            await prisma.user.upsert({
                where: {
                    email: user.email
                },
                update: {},
                create: {
                    email: user.email,
                    name: user.name || profile?.name || 'Unknown',
                    password: '',
                    image: user.image || '',
                }
            });
            return true;
        },
        async session({ session }) {
            if(!session.user) return session;
            if(!session.user.email) return session;
            const dbUser = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                }
            });
            if(!dbUser) return session;
            session.user.id = dbUser.id;
            return session;
        }
    }
}
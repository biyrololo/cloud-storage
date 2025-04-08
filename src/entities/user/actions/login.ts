"use server";

import bcrypt from "bcrypt";
import { jwtService } from "@/shared/lib/jwtService";
import { cookies } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { z, ZodError } from "zod";

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string(),
})

export async function loginAction(email: string, password: string) {
    try{
        loginSchema.parse({email, password})

        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });
    
        if (!user) {
            throw new ZodError([
                {
                    code: z.ZodIssueCode.custom,
                    message: "Пользователь не найден",
                    path: ["email"],
                },
            ]);
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            throw new ZodError([
                {
                    code: z.ZodIssueCode.custom,
                    message: "Неверный пароль",
                    path: ["password"],
                },
            ]);
        }
    
        const token = jwtService.createToken({
            id: user.id,
            email: user.email,
        });
    
        const cookieStore = await cookies();
    
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,  
        })
        
        const return_user = {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    
        return {
            success: true,
            user: return_user,
        };
    } catch(error){
        if (error instanceof z.ZodError) {
            const errors = error.errors.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {} as Record<string, string>);

            return { success: false, errors };
        }

        return { success: false, errors: { general: 'Неизвестная ошибка' } };
    }
}
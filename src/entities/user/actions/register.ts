"use server";

import bcrypt from "bcrypt";
import { jwtService } from "@/shared/lib/jwtService";
import { cookies } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const registerFormSchema = z.object({
    name: z.string().min(3, 'Минимум 3 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
})

const saltRounds = 10;

export async function registerAction(email: string, name: string, password: string) {
    try {
        registerFormSchema.parse({email, name, password})

        const candidate = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { name },
                ]
            }
        })

        if (candidate) {
            if(candidate.email === email){
                return {
                    success: false,
                    errors: {
                        email: 'Пользователь с таким email уже существует'
                    }
                }
            } else {
                return {
                    success: false,
                    errors: {
                        name: 'Пользователь с таким именем уже существует'
                    }
                }
            }
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    
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
        });
    
        return {
            success: true,
            user,
        };
    } catch (error) {
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
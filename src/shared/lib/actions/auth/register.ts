"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { jwtService } from "../../jwtService";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const saltRounds = 10;

const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(4, 'Username must be at least 4 characters'),
})

export async function register(_: unknown, formData: FormData) {
    const rawValues = {
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    }

    const validatedFields = registerSchema.safeParse(rawValues);

    if (!validatedFields.success) {
        return { 
            error: validatedFields.error.flatten().fieldErrors,
            values: rawValues,
          };
    }

    const candidate = await prisma.user.findUnique({
        where: {
            email: validatedFields.data.email,
        },
    });

    if (candidate) {
        return {
            error: {
                email: ['Email already in use'],
            },
            values: rawValues,
        };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, saltRounds);

    const user = await prisma.user.create({
        data: {
            ...validatedFields.data,
            password: hashedPassword,
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
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        values: rawValues
    }
}
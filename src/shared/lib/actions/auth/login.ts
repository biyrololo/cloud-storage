"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { jwtService } from "../../jwtService";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string(),
})

export async function login(_: unknown, formData: FormData) {
    const rawValues = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const validatedFields = loginSchema.safeParse(rawValues);

    if (!validatedFields.success) {
        return { 
            error: validatedFields.error.flatten().fieldErrors,
            values: rawValues,
          };
    }

    const user = await prisma.user.findUnique({
        where: {
            email: validatedFields.data.email,
        },
    });

    if (!user) {
        return {
            error: {
                email: ['User not found'],
            },
            values: rawValues,
        };
    }

    const isPasswordValid = await bcrypt.compare(validatedFields.data.password, user.password);

    if (!isPasswordValid) {
        return {
            error: {
                password: ['Invalid password'],
            },
            values: rawValues,
        };
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
    });
    
    return {
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    }
}
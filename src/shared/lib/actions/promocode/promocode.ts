'use server'

import { prisma } from "@/shared/lib/prisma";
import { getMe } from "@/shared/lib/actions/auth/getMe";

export async function usePromoCode(_: unknown, formData: FormData) {
    const code = (formData.get('code') as string).toUpperCase();
    const rawValues = {code};

    if(!code) {
        return {
            error: {
                code: "Enter a promocode",
            },
            values: rawValues,
        };
    }

    const user = await getMe();

    if(!user) {
        return {
            error: {
                code: "User not found",
            },
            values: rawValues,
        };
    }

    const promoCode = await prisma.promoCode.findUnique({
        where: {
            code,
        },
    });

    if(!promoCode) {
        return {
            error: {
                code: "Promocode not found",
            },
            values: rawValues,
        };
    }
    
    if(promoCode.expiresAt < new Date()) {
        return {
            error: {
                code: "Promocode expired",
            },
            values: rawValues,
        };
    }

    if(promoCode.usageCount === 0) {
        return {
            error: {
                code: "Promocode usage limit reached",
            },
            values: rawValues,
        };
    }
    
    if(user.maxSpace >= promoCode.maxSpace) {
        return {
            error: {
                code: "Your max space is greater than promo code max space",
            },
            values: rawValues,
        };
    }
    
    await prisma.promoCode.update({
        where: {
            id: promoCode.id,
        },
        data: {
            usageCount: promoCode.usageCount - 1,
        },
    });

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            maxSpace: promoCode.maxSpace,
        },
    });

    return {
        success: "Promocode applied successfully",
        values: rawValues,
    };
}
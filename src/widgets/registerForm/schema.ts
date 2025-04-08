import { z } from "zod";

export const registerFormSchema = z.object({
    name: z.string().min(3, 'Минимум 3 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Пароли не совпадают',
            path: ['confirmPassword']
        })
    }
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
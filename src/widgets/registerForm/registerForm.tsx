"use client"

import { useForm } from "react-hook-form";
import { RegisterFormSchema, registerFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid2, TextField, Button, Typography } from "@mui/material";
import { registerAction } from "@/entities/user";
import { ReduxProvider } from "@/shared/lib/store/provider";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
    const router = useRouter();
    const dispatch = useTypedDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema)
    })

    const onSubmit = async (data: RegisterFormSchema) => {
        try{
            const result = await registerAction(data.email, data.name, data.password)
            if(result.success){
                console.log('Пользователь зарегистрирован', result.user)
                dispatch(userActions.login(result.user))
                router.push('/')
            } else {
                if(result.errors)
                    Object.entries(result.errors).forEach(([field, message]) => {
                        setError(field as keyof RegisterFormSchema, {
                            type: 'manual',
                            message,
                        });
                    });
            }
        } catch(e){
            console.log(e)
        }
    }

    return (
        <Grid2 container component="form" onSubmit={handleSubmit(onSubmit)}
        className='w-fit max-w-[400px]'
        >
            <Typography component="h1" variant="h5" className='text-center w-full'>
                Регистрация
            </Typography>
            <TextField
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Имя"
                name="name"
                autoComplete="name"
                autoFocus
            />
            <TextField
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="new-password"
            />
            <TextField
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
            />
            <Typography variant="body2" className="text-center w-full">
                Уже есть аккаунт? <Link href="/login" className="underline text-blue-500">
                    Войти
                </Link>
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
            >
                Зарегистрироваться
            </Button>
        </Grid2>
    )
}

export function RegisterFormWrapper() {
    return (
        <ReduxProvider>
            <RegisterForm />
        </ReduxProvider>
    )
}
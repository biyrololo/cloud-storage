"use client"

import { useForm } from "react-hook-form";
import { Grid2, TextField, Button, Typography } from "@mui/material";
import { loginAction } from "@/entities/user";
import { ReduxProvider } from "@/shared/lib/store/provider";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LoginFormSchema = {
    email: string;
    password: string;
};

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useTypedDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormSchema>({
    })

    const onSubmit = async (data: LoginFormSchema) => {
        try{
            const result = await loginAction(data.email, data.password)
            if(result.success){
                console.log('Пользователь зарегистрирован', result.user)
                dispatch(userActions.login(result.user))
                const redirect = searchParams.get('redirect');
                if(redirect){
                    router.push(redirect)
                } else {
                    router.push('/')
                }
            } else {
                if(result.errors)
                    Object.entries(result.errors).forEach(([field, message]) => {
                        setError(field as keyof LoginFormSchema, {
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
                Вход
            </Typography>
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
            <Typography variant="body2" className="text-center w-full">
                Еще нет аккаунта? <Link href="/register" className="underline text-blue-500">
                    Зарегистрироваться
                </Link>
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
            >
                Войти
            </Button>
        </Grid2>
    )
}

export function LoginFormWrapper() {
    return (
        <ReduxProvider>
            <LoginForm />
        </ReduxProvider>
    )
}
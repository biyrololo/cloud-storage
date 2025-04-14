"use client"

import { login } from "@/shared/lib/actions/auth/login";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";
import { useEffect } from "react";

export function LoginForm() {
    const router = useRouter();
    const dispatch = useTypedDispatch();
    const [state, formAction, isPending] = useActionState(login, {
        error: {},
        values: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if(state.success) {
            dispatch(userActions.login(state.user));
            router.push('/storage');
        }
    }, [state.success]);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <form action={formAction}
                className="grid gap-7 p-4 sm:min-w-[400px]"
            >
                <Typography variant="h5" textAlign={'center'} sx={{fontSize: {
                    xs: '1.3rem',
                    sm: '2rem',
                }}}>Welcome Back!</Typography>
                <div className="grid gap-4">
                    <TextField 
                        label="Email"
                        name="email"
                        defaultValue={state.values?.email || ''}
                        error={!!state.error?.email}
                        helperText={state.error?.email}
                        type="email"
                        autoComplete="off"
                        required
                        variant='standard'
                    />
                    <TextField 
                        label="Password"
                        name="password"
                        defaultValue={state.values?.password || ''}
                        error={!!state.error?.password}
                        helperText={state.error?.password}
                        type="password"
                        autoComplete="off"
                        required
                        variant='standard'
                    />
                    <Link href="/auth/register">
                        <Typography variant="body2" textAlign={'center'}>Don&apos;t have an account? <span className="text-primary">Register</span></Typography> 
                    </Link>
                </div>
                <Button loading={isPending} variant="contained" type="submit">Login</Button>
            </form>
        </Box>
    )
}
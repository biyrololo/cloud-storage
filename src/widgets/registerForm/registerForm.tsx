"use client"

import { register } from "@/shared/lib/actions/auth/register";
import { Box, TextField, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";
import { useEffect } from "react";

export function RegisterForm() {
    const router = useRouter();
    const dispatch = useTypedDispatch();
    const [state, formAction, isPending] = useActionState(register, {
        error: {},
        values: {
            email: '',
            password: '',
            name: '',
        },
    });

    useEffect(() => {
        if(state.success) {
            dispatch(userActions.login(state.user));
            router.push('/storage');
        }
    }, [state.success, dispatch, router, state.user]);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <form action={formAction}
                className="grid gap-7 p-4 sm:min-w-[400px]"
            >
                <Typography variant="h5" textAlign={'center'} sx={{fontSize: {
                    xs: '1.3rem',
                    sm: '2rem',
                }}}>Create an account</Typography>
                <div className="grid gap-4">
                    <TextField 
                        label="Username"
                        name="name"
                        defaultValue={state.values?.name || ''}
                        error={!!state.error?.name}
                        helperText={state.error?.name}
                        type="text"
                        autoComplete="off"
                        required
                        variant='standard'
                    />
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
                    <Link href="/auth/login">
                        <Typography variant="body2" textAlign={'center'}>Already have an account? <span className="text-primary">Login</span></Typography>
                    </Link>
                </div>
                <Button loading={isPending} variant="contained" type="submit">Register</Button>
            </form>
        </Box>
    )
}
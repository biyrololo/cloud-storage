'use client'

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";

const callbackUrl = '/storage'

export function AuthForm(){
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <form 
            className="grid gap-7 p-4 sm:min-w-[300px]"
            >
                <Typography 
                variant="h3" 
                textAlign={'center'}>
                    Bn Storage
                </Typography>
                <Typography 
                variant="h4" 
                textAlign={'center'}>
                    Sign in
                </Typography>
                <div className="grid gap-4">
                    <Button
                    startIcon={<Image src={'/images/oauth/google.png'} alt="Google" width={20} height={20} />}
                    variant="outlined"
                    size="large"
                    sx={{textTransform: 'none', borderRadius: '30px'}}
                    onClick={()=> signIn('google', {callbackUrl})}
                    >
                        Sign in with Google
                    </Button>
                </div>
            </form>
        </Box>
    )
}
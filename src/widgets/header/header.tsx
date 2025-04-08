"use client";

import { AppBar, Avatar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useTypedSelector } from "@/shared/lib/store/store";
import { ReduxProvider } from "@/shared/lib/store/provider";
const pages = ['Products', 'Pricing', 'Blog'];

function HeaderComponent(){
    const user = useTypedSelector(state => state.user.user);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters
                    sx={{
                        justifyContent: 'space-between',
                    }}
                >
                    <Box className="flex gap-4">
                        {
                            pages.map((page) => (
                                <Button
                                    key={page}
                                    color="inherit"
                                >
                                    <Link href={`/${page.toLowerCase()}`}>
                                            {page}
                                    </Link>
                                </Button>
                            ))
                        }
                    </Box>
                    {
                        user ? (
                            <Box className="flex gap-2 items-center">
                                <Avatar>
                                    {user.name[0]}
                                </Avatar>
                                <Typography variant="h6" fontWeight={600}>
                                    {user.name}
                                </Typography>
                            </Box>
                        ) : (
                            <Button color="inherit">
                                <Link href="/login">
                                    Login
                                </Link>
                            </Button>
                        )
                    }
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export function Header(){
    return (
        <ReduxProvider>
            <HeaderComponent />
        </ReduxProvider>
    )
}
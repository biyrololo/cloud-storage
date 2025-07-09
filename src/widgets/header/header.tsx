"use client";

import { Button, Typography } from "@mui/material";

import { HeaderUser } from "../headerUser/headerUser";
import Image from "next/image";
import Link from "next/link";
import { useTypedSelector } from "@/shared/lib/store/store";

export function Header(){
    const user = useTypedSelector(state => state.user.user);

    return (
        <>
            <header className="flex justify-between items-center px-10 py-6">
                <div className="flex items-center gap-2">
                    <Image src={'/logo.png'} alt="BN Storage" width={24} height={24} />
                    <Link href="/">
                        <Typography variant="h6">
                            BN Storage
                        </Typography>
                    </Link>
                </div>
                <Link href={'/pricing'} className="hidden sm:block">
                    <Typography variant="body1" color="text.secondary">
                        Pricing
                    </Typography>
                </Link>
                <Link href={'/news'} className="hidden sm:block">
                    <Typography variant="body1" color="text.secondary">
                        News
                    </Typography>
                </Link>
                {
                    user ? (
                        <HeaderUser />
                    ) : (
                        <Link href="/auth">
                            <Button variant="contained" sx={{textTransform: 'none', borderRadius: '30px'}}>
                                Get Started
                            </Button>
                        </Link>
                    )
                }
            </header>
            <nav className="sm:hidden flex justify-center items-center gap-4 box-border px-10">
                <Link href={'/pricing'}>
                    <Typography variant="body1" color="text.secondary">
                        Pricing
                    </Typography>
                </Link>
                <Link href={'/news'}>
                    <Typography variant="body1" color="text.secondary">
                        Pricing
                    </Typography>
                </Link>
            </nav>
        </>
    )
}
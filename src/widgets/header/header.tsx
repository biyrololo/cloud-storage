"use client";

import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { useTypedSelector } from "@/shared/lib/store/store";
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import { HeaderUser } from "../headerUser/headerUser";

export function Header(){
    const user = useTypedSelector(state => state.user.user);

    return (
        <>
            <header className="flex justify-between items-center px-10 py-6">
                <div className="flex items-center gap-2">
                    <ChangeHistoryIcon />
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
                {
                    user ? (
                        <HeaderUser />
                    ) : (
                        <Link href="/auth/register">
                            <Button variant="contained" sx={{textTransform: 'none', borderRadius: '30px'}}>
                                Get Started
                            </Button>
                        </Link>
                    )
                }
            </header>
            <nav className="sm:hidden flex justify-between items-center gap-4 box-border px-10">
                <Link href={'/pricing'}>
                    <Typography variant="body1" color="text.secondary">
                        Pricing
                    </Typography>
                </Link>
            </nav>
        </>
    )
}
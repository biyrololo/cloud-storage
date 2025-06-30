"use client"

import { Avatar, Divider, Menu, MenuItem, Typography } from "@mui/material";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { useTypedSelector } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";

export function HeaderUser() {
    const user = useTypedSelector(state => state.user.user)!;
    const dispatch = useTypedDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        dispatch(userActions.logout());
        await signOut({callbackUrl: '/'});
        handleClose();
    };

    const handleOpenStorage = () => {
        router.push('/storage')
        handleClose();
    }

    return (
        <div>
            <Avatar 
                onClick={handleClick}
                sx={{backgroundColor: 'primary.main', cursor: 'pointer'}}
                src={user.image}    
            >
                {!user.image && user.name.charAt(0)}
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
            >
                <Typography variant="h6" sx={{px: 2}}>{user.name}</Typography>
                <Typography variant="body1" sx={{px: 2}}>{user.email}</Typography>
                <Divider sx={{my: 1}}/>
                <MenuItem onClick={handleOpenStorage}>Storage</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    )
}
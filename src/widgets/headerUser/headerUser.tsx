"use client"

import { Avatar, Menu, MenuItem } from "@mui/material";
import { useTypedSelector } from "@/shared/lib/store/store";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { useState } from "react";
import { logout } from "@/shared/lib/actions/auth/logout";
import { userActions } from "@/entities/user";
import { useRouter } from "next/navigation";

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
        await logout();
        dispatch(userActions.logout());
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
            sx={{backgroundColor: 'primary.main', cursor: 'pointer'}}>
                {user.name.charAt(0)}
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleOpenStorage}>Storage</MenuItem>
            </Menu>
        </div>
    )
}
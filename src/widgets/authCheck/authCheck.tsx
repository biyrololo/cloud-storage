"use client";

import { useEffect } from "react";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";

export function AuthCheck(){
    const dispatch = useTypedDispatch();
    
    useEffect(() => {
        const checkAuth = async () => {
            const user = await getMe();
            if(user){
                dispatch(userActions.login(user));
            }
        }
        checkAuth();
    }, []);

    return null;
}
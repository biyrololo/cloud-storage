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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, usedSpace, maxSpace, ...rest } = user;
                dispatch(userActions.login(rest));
            }
        }
        checkAuth();
    }, []);

    return null;
}
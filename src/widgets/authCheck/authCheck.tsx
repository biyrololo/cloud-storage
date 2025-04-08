"use client";

import { useEffect } from "react";
import { findMe } from "@/entities/user";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";
import { ReduxProvider } from "@/shared/lib/store/provider";

function AuthCheckComponent(){
    const dispatch = useTypedDispatch();
    
    useEffect(() => {
        const checkAuth = async () => {
            const user = await findMe();
            console.log(user);
            if(user){
                dispatch(userActions.login(user));
            }
        }
        checkAuth();
    }, []);

    return null;
}

export function AuthCheck(){
    return (
        <ReduxProvider>
            <AuthCheckComponent />
        </ReduxProvider>
    )
}
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTypedDispatch } from "@/shared/lib/store/store";
import { userActions } from "@/entities/user";

export function AuthCheck(){
    const dispatch = useTypedDispatch();
    const session = useSession();
    
    useEffect(() => {
        if(session.status !== 'authenticated') return;
        const user = session.data?.user;
        if(user){
            dispatch(userActions.login(user));
        }
    }, [session.status]);

    return null;
}
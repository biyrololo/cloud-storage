import { LoginFormWrapper } from "@/widgets/loginForm/loginForm";
import { Suspense } from "react";

export default function LoginPage(){
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <main className='flex justify-center mt-[100px]'>
                <LoginFormWrapper />
            </main>
        </Suspense>
    )
}
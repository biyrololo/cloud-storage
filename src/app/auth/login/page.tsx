import { getMe } from "@/shared/lib/actions/auth/getMe";
import { LoginForm } from "@/widgets/loginForm/loginForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "BN Storage - Login",
    description: "Login to BN Storage",
}

export default async function LoginPage() {
    const me = await getMe();

    if(me){
        return redirect('/storage');
    }
    return (
        <main>
            <LoginForm />
        </main>
    )
}
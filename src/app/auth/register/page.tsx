import { getMe } from "@/shared/lib/actions/auth/getMe";
import { RegisterForm } from "@/widgets/registerForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "BN Storage - Register",
    description: "Register to BN Storage",
}

export default async function RegisterPage() {
    const me = await getMe();

    if(me){
        return redirect('/storage');
    }
    return (
        <main>
            <RegisterForm />
        </main>
    )
}
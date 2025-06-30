import { AuthForm } from "@/widgets/authForm/authForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "BN Storage - Sign In",
    description: "Login to BN Storage",
}

export default async function LoginPage() {
    return (
        <main>
            <AuthForm />            
        </main>
    )
}
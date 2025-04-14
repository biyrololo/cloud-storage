import { LoginForm } from "@/widgets/loginForm/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "BN Storage - Login",
    description: "Login to BN Storage",
}

export default function LoginPage() {
    return (
        <main>
            <LoginForm />
        </main>
    )
}
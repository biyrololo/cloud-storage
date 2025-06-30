import { Metadata } from "next";
import { RegisterForm } from "@/widgets/registerForm";

export const metadata: Metadata = {
    title: "BN Storage - Register",
    description: "Register to BN Storage",
}

export default async function RegisterPage() {
    return (
        <main>
            <RegisterForm />
        </main>
    )
}
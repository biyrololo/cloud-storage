import { RegisterForm } from "@/widgets/registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "BN Storage - Register",
    description: "Register to BN Storage",
}

export default function RegisterPage() {
    return (
        <main>
            <RegisterForm />
        </main>
    )
}
import { Divider, Typography } from "@mui/material";

import { Header } from "@/widgets/header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "BN Storage - News",
    description: "News of BN Storage",
}

export default function NewsPage() {
    return (
        <>
            <Header />
            <main className="flex flex-col items-center justify-center gap-8">
                <Typography variant="h2">News</Typography>
                <div className="flex flex-col gap-4 w-full px-12">
                    <section className="flex flex-col gap-4">
                        <Typography variant="h3">OAuth - Google</Typography>
                        <Typography variant="body2">30.06.2025</Typography>
                        <Typography variant="body1">Google OAuth has been added</Typography>
                        <Divider />
                    </section>
                    <section className="flex flex-col gap-4">
                        <Typography variant="h3">OAuth</Typography>
                        <Typography variant="body2">30.06.2025</Typography>
                        <Typography variant="body1">Oauth has replaced email and password login</Typography>
                        <Divider />
                    </section>
                    <section className="flex flex-col gap-4">
                        <Typography variant="h3">Start!</Typography>
                        <Typography variant="body2">30.06.2025</Typography>
                        <Typography variant="body1">News page created today</Typography>
                        <Divider />
                    </section>
                </div>
            </main>
        </>
    )
}
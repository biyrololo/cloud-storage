"use client";

import { ReduxProvider } from "@/shared/lib/store/provider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/shared/lib/providers/themeProvider";

export function Providers({ children }: React.PropsWithChildren) {
    return (
        <ThemeProvider>
            <ReduxProvider>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </ReduxProvider>
        </ThemeProvider>
    );
}
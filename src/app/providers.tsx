"use client";

import { ThemeProvider } from "@/shared/lib/providers/themeProvider";
import { ReduxProvider } from "@/shared/lib/store/provider";

export function Providers({ children }: React.PropsWithChildren) {
    return (
        <ThemeProvider>
            <ReduxProvider>
                {children}
            </ReduxProvider>
        </ThemeProvider>
    );
}
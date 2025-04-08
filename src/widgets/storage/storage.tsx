"use client"

import { ReduxProvider } from "@/shared/lib/store/provider"
import { StorageDisplay } from "@/widgets/storageDisplay/storageDisplay"
import { StorageSpeedDial } from "@/widgets/storageSpeedDial"

export function Storage(){
    return (
        <ReduxProvider>
            <main>
                <StorageSpeedDial />
                <StorageDisplay />
            </main>
        </ReduxProvider>
    )
}
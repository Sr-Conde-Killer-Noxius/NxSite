"use client"

import { TRPCProvider } from "./trpcProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <TRPCProvider>
            {children}
        </TRPCProvider>
    )
}



  
  
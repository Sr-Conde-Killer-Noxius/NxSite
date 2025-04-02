"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useLanguage } from "@/hooks/language/useLanguage";

import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect } from "react";

export function RequireAuth<T extends object>(Component: ComponentType<T>) {    
    return function AuthenticatedComponent(props: T) {
        const {userData, loadingUser}   = useAuth();
        const language                  = useLanguage()        
        const router                    = useRouter();
        
        useEffect(() => {
            if (!userData && !loadingUser) {                
                router.push(`/${language}`);
            }
        }, [language, userData, loadingUser, router]);


        if (!userData) return null
        return <Component {...props} />;
    };
}

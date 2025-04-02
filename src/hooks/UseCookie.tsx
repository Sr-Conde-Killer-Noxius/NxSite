"use client";

export const useCookie = {
    HasCookieConsent: (): boolean => {
        if (typeof window === "undefined") return false; // Verifica se está no servidor
        const consent = localStorage.getItem("cookieConsent");
        return consent !== undefined && consent === "true";
    },

    withConsent: (use_cookie: () => string | null): string | null => {
        if (typeof window === "undefined") return null; // Garante que não roda no servidor
        if (useCookie.HasCookieConsent()) {
            return use_cookie();
        }
        return null;
    },

    get: (key: string): string | null => {
        return useCookie.withConsent(() => localStorage.getItem(key));
    },

    set: (key: string, value: string): void => {
        if (typeof window === "undefined") return; // Evita erro no servidor
        useCookie.withConsent(() => {
            localStorage.setItem(key, value);
            return null;
        });
    }
};

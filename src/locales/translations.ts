"use client"
import { Locale_t, LocalePhrases } from "@/types/locales"
import LOCALE_PTBR from "@/locales/ptBr"
import LOCALE_EN  from "@/locales/en"
import { SupportedLanguages_t } from "@/middleware_layers/security/CheckRouteProtection";
export const    defaultLocale: SupportedLanguages_t = "ptBr";

export const translations: Record<SupportedLanguages_t, Locale_t> = {
    ptBr: LOCALE_PTBR,
    en:   LOCALE_EN,
};

export const TranslatePhrase = (
    language:   SupportedLanguages_t,
    key:        LocalePhrases
  ): string => {
    try {        
        const locale: Locale_t = translations[language];        
        // Return translation or fallback
        return locale[key] ?? "tradução pendente";
    } catch (error) {
        console.error(`Erro ao buscar tradução para "${key}" em "${language}":`, error);
        return "tradução pendente";
    }
};
  
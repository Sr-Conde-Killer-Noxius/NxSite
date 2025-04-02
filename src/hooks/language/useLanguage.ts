"use client";
import { defaultLocale } from "@/locales/translations";
import { SupportedLanguages_t } from "@/middleware_layers/security/CheckRouteProtection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SupportedLanguages: Set<SupportedLanguages_t> = new Set(["en", "ptBr"]);

export function useLanguage(): SupportedLanguages_t {
  const { language } = useParams(); // Sempre chamado
  const [siteLanguage, setSiteLanguage] = useState<SupportedLanguages_t>("ptBr");

  useEffect(() => {
    // Evita chamadas de Hooks condicionais
    const storedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") : null;

    if (storedLanguage && SupportedLanguages.has(storedLanguage as SupportedLanguages_t)) {
      setSiteLanguage(storedLanguage as SupportedLanguages_t);
    } else if (SupportedLanguages.has(language as SupportedLanguages_t)) {
      setSiteLanguage(language as SupportedLanguages_t);
      if (typeof window !== "undefined") {
        localStorage.setItem("language", language as string);
      }
    }
  }, [language]);

  return SupportedLanguages.has(siteLanguage) ? siteLanguage : defaultLocale;
}

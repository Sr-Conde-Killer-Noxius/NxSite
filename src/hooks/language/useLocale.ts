"use client";
import { translations }  from "@/locales/translations";
import { Locale_t } from "@/types/locales";
import { useLanguage } from "./useLanguage";
import { SupportedLanguages_t } from "@/middleware_layers/security/CheckRouteProtection";


/** @TODO client side ask only once locale to avoid regathering same data */
export function useLocale(): Locale_t {  
  const language: SupportedLanguages_t = useLanguage()
  return translations[language]
}
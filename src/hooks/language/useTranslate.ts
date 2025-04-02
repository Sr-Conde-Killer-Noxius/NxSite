"use client";
import { TranslatePhrase } from "@/locales/translations";

import { LocalePhrases } from "@/types/locales";
import { useLanguage } from "./useLanguage";

export function useTranslate(key: LocalePhrases): string {
  const lang = useLanguage();
  
  return TranslatePhrase(lang, key);
}

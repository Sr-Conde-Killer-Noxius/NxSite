"use client";

import { motion } from "framer-motion";
import { useCookieConsent } from "@/hooks/UseCookieConsent";
import { useLanguage } from "@/hooks/language/useLanguage";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const { hasConsent, acceptCookies } = useCookieConsent();
  const language = useLanguage();
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  useEffect(() => {
    if (hasConsent !== null) {
      setIsConsentChecked(true);  // Marca como verificado
    }    
  }, [hasConsent]);

  // Não renderizar o componente até que o consentimento tenha sido verificado
  if (!isConsentChecked) {
    return null;
  }

  if (hasConsent) {    
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div className="relative bg-gray-900 text-white p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-gray-700 backdrop-blur-lg bg-opacity-90">
        <div className="text-center">
          <h3 className="text-xl font-semibold">🍪 Nós usamos cookies!</h3>
          <p className="text-sm text-gray-300 mt-2">
            Utilizamos cookies para melhorar sua experiência, personalizar conteúdos e anúncios, oferecer funcionalidades de redes sociais e analisar o tráfego do site.
            Além disso, compartilhamos informações sobre o uso do nosso site com nossos parceiros de mídia social, publicidade e análise.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Você pode gerenciar suas preferências ou obter mais informações acessando nossa{" "}
            <Link href={`${language}/policies/usage`} className="text-blue-400 hover:underline">Política de Uso</Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <button
            onClick={acceptCookies}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-lg"
          >
            Entendo e Prosseguir
          </button>
        </div>
      </div>
    </motion.div>
  );
}

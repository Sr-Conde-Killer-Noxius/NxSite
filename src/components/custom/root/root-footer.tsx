"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/language/useLanguage";


export default function RootFooter() {
  const language = useLanguage()
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-gray-400 py-8 mt-10"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Links principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Links</h3>
            <ul className="space-y-2">
              <li><Link href={`/${language}/policies/usage`}    className="hover:text-blue-400">Política de Uso</Link></li>
              <li><Link href={`/${language}/policies/cookies`}  className="hover:text-blue-400">Política de cookies</Link></li>
              <li><Link href={`/${language}/policies/privacy`}  className="hover:text-blue-400">Política de Privacidade</Link></li>            
            </ul>
          </div>

          {/* Sobre o site */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 text-center">Sobre o Telegram Promote</h3>
              <p className="text-sm">
                Bem-vindo ao Telegram Promote!  
                Aqui você encontra os melhores links para canais, bots e grupos do Telegram, reunidos em um só lugar para facilitar sua experiência. 
                Descubra comunidades ativas, conteúdos exclusivos e diversas opções para interagir dentro da plataforma.  
                Ressaltamos que somos um serviço independente, sem qualquer vínculo com o Telegram FZ-LLC.
              </p>
          </div>

          {/* Links de categorias */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Categorias Populares</h3>
            <ul className="space-y-2">
              {/*<li><Link href="/groups" className="hover:text-blue-400">Link de Grupo</Link></li>*/}
              {/*<li><Link href="/stickers" className="hover:text-blue-400">Figurinhas para WhatsApp</Link></li>*/}
              {/*<li><Link href="/quiz" className="hover:text-blue-400">Meu Quiz</Link></li>*/}
              {/*<li><Link href="/memes" className="hover:text-blue-400">Memes Engraçados</Link></li>*/}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-700 mt-8 pt-4">
          <p className="text-gray-500 text-sm">© 2025 - Telegram Promote</p>
        </div>
      </div>
    </motion.footer>
  );
}

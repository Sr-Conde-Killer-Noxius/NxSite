"use client"
import { MetaTag } from "@/components/custom/root/HeadMeta";

export const metasTags: MetaTag[] = [
  // Descrição e Keywords
  { name: "description",            content: "Plataforma para promover grupos de Telegram, conectando usuários a comunidades de interesse." },
  { name: "keywords",               content: "telegram, grupos, promoção, comunidades, dev independente" },
  { name: "author",                 content: "Pedro Henrique Goffi de Paulo" },
  { name: "robots",                 content: "index, follow" },
  // Open Graph Meta Tags (Facebook, LinkedIn, etc.)
  { property: "og:title",           content: "Telegram Promote" },
  { property: "og:description",     content: "Plataforma para promover grupos de Telegram, conectando usuários a comunidades de interesse." },
  { property: "og:image",           content: `${process.env.APP_URI ?? "localhost"}/favicon.ico` },
  { property: "og:image:alt",       content: "Logo da plataforma Telegram Promote" }, // Descrição alternativa para a imagem OG
  { property: "og:url",             content: process.env.APP_URI ?? "localhost" },
  { property: "og:type",            content: "website" },
  { property: "og:site_name",       content: "Telegram Promote" }, // Nome do site no Open Graph
  { property: "og:locale",          content: "pt_BR" }, // Define o local e idioma (ajustado conforme seu público)
  { property: "og:updated_time",    content: "2025-03-07T00:00:00Z" }, // Data de última atualização
  
  // Twitter Meta Tags
  { name: "twitter:card",           content: "summary_large_image" },
  { name: "twitter:title",          content: "Telegram Promote" },
  { name: "twitter:description",    content: "Promova e encontre os melhores grupos de Telegram" },
  { name: "twitter:image",          content: `${process.env.APP_URI ?? "localhost"}/favicon.ico` },
  { name: "twitter:image:alt",      content: "Logo da plataforma Telegram Promote" }, // Descrição alternativa para a imagem do Twitter
  { name: "twitter:creator",        content: "@pedrodev" }, // Autor no Twitter (caso tenha perfil)
  { name: "twitter:site",           content: "@telegrampromote" }, // Handle do Twitter do site
  
  // Tags Essenciais  
  { rel: "canonical",               href: process.env.APP_URI ?? "localhost" }, // URL canônica
  { charSet: "UTF-8" },  

  // Verificação Google
  /** @TODO */
  //{ name: "google-site-verification", content: "your-verification-code" },

  // Configurações de segurança
  { name: "robots",                 content: "noindex, follow" },

  // Outros Metadados Importantes
  { name: "application-name",       content: "Telegram Promote" }, // Nome do App (para PWA ou Windows)
  { name: "theme-color",            content: "#ffffff" }, // Cor da barra de endereço (Android/Chrome)
  { name: "X-UA-Compatible",        content: "IE=edge" }, // Compatibilidade com navegadores antigos (IE)
  
  // Microsoft Tile Image (Windows)
  { name: "msapplication-TileImage", content: `${process.env.APP_URI ?? "localhost"}/favicon.ico` }, // Ícone no Windows
  { name: "msapplication-TileColor", content: "#ffffff" }, // Cor do tile do Windows

  // Apple Web App Meta Tags
  { name: "apple-mobile-web-app-title", content: "Telegram Promote" }, // Título para o iOS
  { name: "apple-mobile-web-app-capable", content: "yes" }, // Modo tela cheia em dispositivos Apple
  { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }, // Cor da barra de status no iOS

  // Gerador do site
  { name: "generator",              content: "Next.js" }, // Ferramenta usada para gerar o site

  { 
    httpEquiv: "Content-Security-Policy",
    econtent: "default-src 'self'; script-src 'self' https://apis.example.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data:;"
  },

  // Adsense tag
  {
    name:     "google-adsense-account",
    content:  "ca-pub-8527210526030632"    
  }
];

/** @type {import('next-sitemap').IConfig} */
const sitemap = {  
  // URL base do seu site (sem barra no final)
  siteUrl: process.env.APP_URI ?? "http://localhost",

  // Gera automaticamente o robots.txt
  generateRobotsTxt: true,

  // Define a prioridade das páginas no sitemap (entre 0.0 e 1.0)
  priority: 0.7,

  // Define a frequência de atualização do conteúdo (opções: always, hourly, daily, weekly, monthly, yearly, never)
  changefreq: "daily",

  // Exclui páginas específicas do sitemap
  exclude: ["/admin", "/api", "/*/admin"],

  // Gera múltiplos sitemaps caso tenha muitas URLs
  sitemapSize: 5000,

  // Configurações avançadas do robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*", // Aplica a todos os bots
        allow: "/", // Permite indexar todas as páginas
        disallow: [
          "/admin", 
          "/api",
          "/*/admin" // Bloqueia qualquer subpágina que contenha "/admin"
        ],
      },
    ],    
  },  
};

export default sitemap;

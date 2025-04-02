import axios from "axios";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {    
    images: {
        remotePatterns: [
          { protocol: "https", hostname: "i.ibb.co" },            
        ]
    },
    
    experimental: {
        reactCompiler:  true,
        optimizeCss:    true,                
    },
    
    async headers() {
        return [
            {
              // Defina a configuração para todas as rotas
              source: '/:path*',
              headers: [
                {
                  key: 'Cross-Origin-Opener-Policy',
                  value: 'same-origin', // ou 'same-origin-allow-popups'
                },
                {
                  key: 'X-Frame-Options',
                  value: 'DENY', // Ou 'SAMEORIGIN' se permitir apenas no mesmo domínio
                },
                {
                  key: 'Content-Security-Policy',
                  value: "frame-ancestors 'none';", // Bloqueia o uso de iframes
                },
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload', // HSTS forte
                },
              ],
            },
        ]
    },

    async redirects() {
        return [
          {
            source: '/:path*',
            has: [
              {
                type: 'header',
                key: 'x-forwarded-proto',
                value: 'http',
              },
            ],
            destination: `${process.env.APP_URI}/:path*`, // Substitua pelo seu domínio
            permanent: true,
          },
        ];
    },
};

export default nextConfig;

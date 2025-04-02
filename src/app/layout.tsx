"use client"; // Força o Next.js a renderizar no cliente
import HeadContent    from "@/components/custom/HeadContent"; // Não usa lazy para o HeadContent
import BodyContent    from "@/components/custom/root/BodyContent"
import { Analytics }  from "@vercel/analytics/next"
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <HeadContent /> {/* Carregamento imediato para HeadContent */}
      <BodyContent>
        {children}
      </BodyContent>
      <Analytics />
    </html>
  );
}

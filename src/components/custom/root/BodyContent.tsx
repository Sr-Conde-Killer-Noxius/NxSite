"use client"; // Força o Next.js a renderizar no cliente
import { lazy, Suspense } from "react";
import { AppProvider } from "../providers/providers";

// Lazy loading dos componentes
const RootNavbar = lazy(() => import("./root-navbar"));
const CookieConsent = lazy(() => import("../CookieConsent"));
const RootFooter = lazy(() => import("./root-footer"));

const BodyContent = ({ children }: {children: React.ReactNode}) => (
  <body className="bg-black text-white">
    <AppProvider>
      {/* Suspense é necessário para renderizar um fallback enquanto os componentes estão sendo carregados */}
      <Suspense fallback={<div>Carregando Navbar...</div>}>
        <RootNavbar />
      </Suspense>
      
      <div className="pt-16">
        {children}
      </div>

      <Suspense fallback={<div>Carregando Cookie Consent...</div>}>
        <CookieConsent />
      </Suspense>

      <Suspense fallback={<div>Carregando Footer...</div>}>
        <RootFooter />
      </Suspense>
    </AppProvider>
  </body>
);

export default BodyContent;

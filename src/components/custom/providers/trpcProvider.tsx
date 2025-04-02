"use client";

import { trpc } from "@/utils/trpc/trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SuperJSON from "superjson";
import { useState, useMemo } from "react";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // Criar um único QueryClient com opções otimizadas
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,     // 5 minutos
          cacheTime: 1000 * 60 * 10,    // 10 minutos
          refetchOnWindowFocus: false,  // Evita re-fetch ao alternar abas
          refetchOnReconnect: "always", // Garante re-fetch quando há reconexão
          refetchOnMount: false,        // Não refetch ao remontar o componente
          retry: 2,                     // **Tenta novamente 2 vezes em caso de falha**          
        },        
      },
    })
  );

  // Memoriza a criação do trpcClient para evitar recriações desnecessárias
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            headers: () => {
              const token = localStorage.getItem("auth-token");
              return token ? { Authorization: `Bearer ${token}` } : {};
            },
          }),
        ],
        transformer: SuperJSON,
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

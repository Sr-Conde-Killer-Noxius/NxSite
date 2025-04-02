"use client"
import { trpc } from "@/utils/trpc/trpc";

export function useAuth() {
  const { data, isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    retry: false,               // Não tentar novamente se não autorizado
    staleTime: 1000 * 60 * 5,   // Cache por 5 minutos
  });
    
  return {
    userData:       data?.user ?? null,
    loadingUser:    isLoading,
    error:          isError,
  };
    
}

"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc/trpc";
import { useLoginFields } from "@/hooks/auth/useLoginFields";
import { ParticlesBackground } from "@/components/custom/ParticlesBackground";





export default function LoginPage() {
  const trpc_utils    = trpc.useUtils()
  const loginFields   = useLoginFields();  
  const router        = useRouter();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async ( data ) => {
      localStorage.setItem("auth-token", data.token);                  
      await trpc_utils.auth.me.refetch()
      router.refresh()
      router.push("/")
    },

    onError: (error) => {                 
      loginFields.setError(error.shape?.message ?? "Erro do servidor!");
    },    
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginFields.setError(null);

    loginMutation.mutate({ 
      email:  loginFields.email, 
      passwd: loginFields.password 
    });            
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black bg-opacity-60">
      <ParticlesBackground />

      {/* Container de login */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white text-center">Bem-vindo</h2>
        <p className="text-gray-300 text-center mb-4">Faça login para continuar</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={loginFields.email}
            onChange={(e) => loginFields.setEmail(e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={loginFields.password}
            onChange={(e) => loginFields.setPassword(e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {loginFields.error && <p className="text-red-500 text-sm">{loginFields.error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition"
            disabled={loginMutation.isLoading}
          >            
            {loginMutation.isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

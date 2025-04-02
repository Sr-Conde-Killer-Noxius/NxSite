"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc/trpc";
import { User } from "@/models/user";
import { AppRouter } from "@/utils/trpc/router";
import { TRPCClientErrorLike } from "@trpc/client";
import { ParticlesBackground } from "@/components/custom/ParticlesBackground";


const schema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Número de telefone inválido"),
  passwd: z.string().min(10, "A senha deve ter pelo menos 10 caracteres"),
});


export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(schema),
  });

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data: { success: boolean, user: User, token: string}) => localStorage.setItem('auth-token', data.token),
    onError: (error: TRPCClientErrorLike<AppRouter>) => setError("passwd", { message: error.shape?.message }),    
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <ParticlesBackground />
      

      
      {/* Formulário */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 mt-16 z-10">
        <h2 className="text-2xl font-bold text-white text-center">Bem-vindo</h2>
        <p className="text-gray-300 text-center mb-4">Crie sua conta para continuar</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Nome"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="E-mail"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("phone")}
              type="text"
              placeholder="Telefone"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div>
            <input
              {...register("passwd")}
              type="password"
              placeholder="Senha"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwd && <p className="text-red-500 text-sm">{errors.passwd.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

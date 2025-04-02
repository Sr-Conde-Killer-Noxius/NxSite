"use client"
import { Lock } from "lucide-react";
import Link from "next/link";

//** @TODO: flag user IP and block if further tries */
export default function ForbiddenPage() {
    

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Lock className="w-16 h-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold">Acesso Negado</h1>
        <p className="mt-2 text-gray-400">Você não tem permissão para acessar esta página.</p>
        <Link
            href="/"
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg text-white"
        >
            Voltar para a página inicial
        </Link>
        </div>
    );
}
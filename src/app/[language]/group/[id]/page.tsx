"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon, ArrowLeft, Flag, Share2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { trpc } from "@/utils/trpc/trpc";
import LoadingScreen from "@/components/custom/LoadingScreen";

export default function GroupPage() {
  const { id } = useParams();
  const router = useRouter();

  const groupQuery = trpc.groups.getGroupById.useQuery(id as string)
  const groupImagePathQuery = trpc.groups.getGroupImagePath.useQuery(id as string);

  if (groupQuery.isLoading || groupImagePathQuery.isLoading) {
    return <LoadingScreen message="Carregando grupo..." />;
  }
  
  if (!groupQuery.data) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Grupo não encontrado: {id}.</p>
      </div>
    );
  }
  
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center w-full max-w-lg mb-6">
        <motion.button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </motion.button>
        <div className="flex gap-4">
          <motion.button className="flex items-center text-gray-400 hover:text-white transition" whileHover={{ scale: 1.1 }}>
            <Flag className="w-5 h-5 mr-2" />
            Denunciar
          </motion.button>
          <motion.button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center text-gray-400 hover:text-white transition"
            whileHover={{ scale: 1.1 }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar
          </motion.button>
        </div>
      </div>

      <motion.div
        className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg max-w-lg w-full text-center backdrop-blur-md border border-gray-700"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div className="relative w-full h-48 rounded-lg overflow-hidden mb-4" whileHover={{ scale: 1.05 }}>
          <Image
            src={groupQuery.data.imageUrl ?? "/default-group-image.jpg"}
            alt={groupQuery.data.name}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">{groupQuery.data.name}</h1>
        <p className="text-gray-300 mb-4">{groupQuery.data.description}</p>

        <div className="flex justify-center items-center gap-6 text-gray-400">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>{groupQuery.data.members.length} membros</span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            <span>{groupQuery.data.link}</span>
          </div>
        </div>

        <motion.a
          href={groupQuery.data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block bg-blue-600 px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-500 transition shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Entrar no Grupo
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
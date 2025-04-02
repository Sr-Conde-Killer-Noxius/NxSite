import { TelegramGroup, GroupMember, Payment, User } from "@prisma/client";
import { z } from "zod";
import prisma from "@/db/prisma";
import { TelegramGroupSchema } from "@/models/telegramgroup";
import { TRPCError } from "@trpc/server";

import axios, { HttpStatusCode }  from "axios"

// Esquema de validação para a criação de um grupo no Telegram

type CreateGroupInput = z.infer<typeof TelegramGroupSchema>;
type UpdateGroupInput = Partial<CreateGroupInput>;

type GroupWithRelations = TelegramGroup & {
  owner: User;
  members: GroupMember[];
  payments: Payment[];
};

/**
 * @function createGroup
 * @description Cria um novo grupo no Telegram após validar os dados de entrada.
 * @param {CreateGroupInput} groupData - Dados do grupo a serem cadastrados.
 * @returns {Promise<TelegramGroup>} Grupo criado no banco de dados.
 * @throws {Error} Se os dados forem inválidos.
 */
export const createGroup = async (groupData: CreateGroupInput): Promise<TelegramGroup> => {  
  const parsed = TelegramGroupSchema.safeParse(groupData);
  if (!parsed.success) {
    throw new TRPCError(
      {
        code:     "BAD_REQUEST",
        message:  parsed.error.errors.toString() //parsed.error.errors.map(err => err.message).join(", ")
      }
    )    
  }   

  
  const res: Response & { data: { endpoint: string, message:  string } } = await axios.post("https://tg-promote-bot-srv.onrender.com/api/tgimg", { telegram_link: parsed.data.link })
  if (res.status !== HttpStatusCode.Ok) {
    throw new TRPCError(
      {
        code:     "INTERNAL_SERVER_ERROR",
        message:  "Falha interna de servidor"
      },
    )
  }  
    
  const imagePath: string | null = res.data.endpoint
  console.log(imagePath)
  if(!imagePath) {
    throw new TRPCError(
      {
        code:     "INTERNAL_SERVER_ERROR",
        message:  "Falha interna de servidor"
      },
    )
  }
    
  
  return await prisma.telegramGroup.create({ 
    data: {
      ...parsed.data,
      name:     imagePath,
      imageUrl: imagePath,      
    }
  });
};

/**
 * @function getGroupById
 * @description Busca um grupo pelo ID e retorna seus dados completos, incluindo relacionamentos.
 * @param {string} id - ID único do grupo.
 * @returns {Promise<GroupWithRelations | null>} Grupo encontrado ou `null` se não existir.
 * @throws {Error} Se o ID for inválido.
 */
export const getGroupById = async (id: string): Promise<GroupWithRelations | null> => {
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) {
    throw new Error("ID inválido.");
  }

  return await prisma.telegramGroup.findUnique({
    where: { 
      id: parsed.data 
     },
    include: {
      owner:    true,
      members:  true,
      payments: true,
    },
  });
};

/**
 * @function getAllGroups
 * @description Retorna uma lista com todos os grupos cadastrados.
 * @returns {Promise<GroupWithRelations[]>} Lista de grupos.
 */
export const getAllGroups = async (): Promise<GroupWithRelations[]> => {
  return await prisma.telegramGroup.findMany({
    include: {
      owner: true,
      members: true,
      payments: true,
      subscriptionPlan: true
    },
  });
};

/**
 * @function updateGroup
 * @description Atualiza os dados de um grupo existente no banco de dados.
 * @param {string} id - ID do grupo a ser atualizado.
 * @param {UpdateGroupInput} groupData - Dados a serem atualizados.
 * @returns {Promise<TelegramGroup>} Grupo atualizado.
 * @throws {Error} Se o ID ou os dados forem inválidos.
 */
export const updateGroup = async (id: string, groupData: UpdateGroupInput): Promise<TelegramGroup> => {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido.");
  }

  const parsedData = TelegramGroupSchema.partial().safeParse(groupData);
  if (!parsedData.success) {
    throw new Error(parsedData.error.errors.map(err => err.message).join(", "));
  }

  return await prisma.telegramGroup.update({
    where: { id: parsedId.data },
    data: parsedData.data,
  });
};

/**
 * @function deleteGroup
 * @description Exclui um grupo do banco de dados.
 * @param {string} id - ID do grupo a ser removido.
 * @returns {Promise<TelegramGroup>} Grupo excluído.
 * @throws {Error} Se o ID for inválido.
 */
export const deleteGroup = async (id: string): Promise<TelegramGroup> => {
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) {
    throw new Error("ID inválido.");
  }

  return await prisma.telegramGroup.delete({
    where: { id: parsed.data },
  });
};

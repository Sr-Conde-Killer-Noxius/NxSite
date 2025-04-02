import { Prisma } from "@prisma/client";
import { z } from "zod";

// passwd is used only in the backend! we'll Omit around the code
export type BACKEND_FULL_User   = Prisma.UserCreateInput
export type User                = Omit<BACKEND_FULL_User, 'passwd'>;

export const UserSchema = z.object({  
  name:       z.string().min(1,  "Nome obrigatório"),  // Nome do usuário.
  passwd:     z.string().min(10, "Senha inválida"),
  phone:      z.string().min(10, "Número inválido"),   // Telefone do usuário.
  email:      z.string().email("Email inválido"),  
});


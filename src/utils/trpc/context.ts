import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import jwt from "jsonwebtoken";
import prisma from "@/db/prisma";
import { BACKEND_FULL_User, User } from "@/models/user";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function createContext(req: NextRequest) {  
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  let optBackendFullUser: BACKEND_FULL_User | null = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      optBackendFullUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    } catch {} // Unauthenticated users, don't need to do anything in this block...
  }


  let user: User | null = null 
  if(optBackendFullUser) {
    const { passwd, ...frontendUserData } = optBackendFullUser
     
    user = frontendUserData
  }
  
  return { req, user };
}


export type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC
  .context<Context>()
  .create({ transformer: SuperJSON });

export default t

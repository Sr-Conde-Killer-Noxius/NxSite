import { TRPCError } from "@trpc/server";
import t from "./context";
import { ReasonPhrases } from 'http-status-codes'
import prisma from "@/db/prisma";
import { Permission } from "@prisma/client";

export const router = t.router;
export const publicProcedure = t.procedure;

export const superAdminAuthProcedure   = t.procedure
    .use(async ({ ctx, next }) => {
        if(!ctx.user){
            throw new TRPCError({
                code:       "UNAUTHORIZED",
                message:    ReasonPhrases.UNAUTHORIZED,
            });
        }

        const permissions = await prisma.permission.findMany({ where: { users: { some: { userId: ctx.user?.id } } } })
        if(permissions == null){
            throw new TRPCError({
                code:       "UNAUTHORIZED",
                message:    ReasonPhrases.UNAUTHORIZED,
            });
        }

        const hasPermission: boolean = permissions.some((permission: Permission) => permission.name === "super-admin")
        if(!hasPermission) {
            throw new TRPCError({
                code:       "UNAUTHORIZED",
                message:    ReasonPhrases.UNAUTHORIZED,
            });
        }

        return next({ ctx })
    })
    
export const requireAuthProcedure = t.procedure
    .use(({ctx, next}) => {        
        if(!ctx.user){
            throw new TRPCError({
                code:       "UNAUTHORIZED",
                message:    ReasonPhrases.UNAUTHORIZED,
            });
        }

        return next({ ctx });
    })
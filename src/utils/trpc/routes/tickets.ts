import { z } from "zod";
import t from "../context";
import { requireAuthProcedure, superAdminAuthProcedure } from "../procedures";
import prisma from "../../../db/prisma";
import { TRPCError } from "@trpc/server";


export const TicketSchema = z.object({
    subject: z.string(),
    message: z.string(),
    priority: z.enum(["baixa", "média", "alta"])
})

export const TicketResponseSchema = z.object({
    ticketId: z.string().uuid(),
    message: z.string().min(1, "A resposta é obrigatória"),
});


export const ticketsRouter = t.router({
    MyTickets: requireAuthProcedure.query(async ({ ctx }) => {
        if(ctx.user == null) {
            return []
        }

        return prisma.ticket.findMany({
            where:      { userId: ctx.user.id },
            include:    { responses: true }
        });
    }),
    

    AddTicket: requireAuthProcedure.input(TicketSchema).mutation(async ({ ctx, input }) => {
        if(!ctx.user || !ctx.user.id)  throw new TRPCError({ code: "UNAUTHORIZED" })
        

        return await prisma.ticket.create({
            data: {
                userId: ctx.user.id,
                subject: input.subject,
                message: input.message,
                status: "open",
                priority: input.priority
            }
        });
    }),
    


    DeleteTicket: requireAuthProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => { 
        await prisma.ticket.deleteMany({
            where: {
                id: input.id,
                userId: ctx.user?.id,
            },
        });
    }),



    AnswerTicket: superAdminAuthProcedure.input(TicketResponseSchema).mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) {
            throw new TRPCError({
                code:       "UNAUTHORIZED",
                message:    "Usuário não autenticado.",
            });
        }
    
        const response = await prisma.ticketResponse.create({
            data: {
                ticketId:   input.ticketId,
                message:    input.message,
                userId:     ctx.user.id, // Agora garantimos que sempre será um string válido.
            },            
        });

        await prisma.ticket.update({
            where:  { id: input.ticketId },
            data:   { status: "closed" }
        })

        return response
    }),

    GetAllTickets: 
        superAdminAuthProcedure
        .query(async () => await prisma.ticket.findMany({ where: { NOT: { status: "closed" } } })),    
})
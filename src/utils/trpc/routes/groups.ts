import { publicProcedure, requireAuthProcedure } from "@/utils/trpc/procedures";
import t from "../context";
import { TelegramGroupSchema } from "@/models/telegramgroup";
import { createGroup, getAllGroups, getGroupById } from "@/db/queries/groups";
import prisma from "@/db/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

//**@TODO CACHE WITH TTL THE GROUPS TO AVOID FETCHING THE DATABASE MASSIVELY*/
const getGroupImagePathSchema = z.string().uuid().nonempty();
const pagedGroupsSchema = z.object({
    page:       z.number().positive().max(100, "Page number is too large. Please choose a smaller value."),
    elements:   z.number().positive().max(50, "Too many elements per page. Please choose a smaller value."),
})

export type PagedGroups = z.infer<typeof pagedGroupsSchema>
export const groupsRouter = t.router({
    createGroup: publicProcedure        
        .input(TelegramGroupSchema)    
        .mutation(async ({ input, ctx }) => {
            if(!ctx.user) {
                throw new TRPCError({
                    code:       "UNAUTHORIZED",
                    message:    "Usuário não autenticado"
                })
            }                

            const userCreatedGroupsCount = await prisma.telegramGroup.count({
                where: { 
                    ownerId: ctx.user.id
                }
            })

            if(userCreatedGroupsCount > 3) {                
                const userPaidGroupsCount = await prisma.telegramGroup.count({
                    where: {
                        ownerId: ctx.user.id,
                        subscriptionPlanId: {
                            not: null                            
                        },
                        subscriptionPlan: {
                            price: {
                                gt: 0
                            }
                        }
                    },                    
                })

                const maxAllowedGroups: number = userPaidGroupsCount * 3
                if(userCreatedGroupsCount > maxAllowedGroups) {
                    // a cada 1 pago o usuario pode criar 3
                    throw new TRPCError({
                        code:       "BAD_REQUEST",
                        message:    "Usuário já criou sua cota limite de grupos"
                    })

                }                                                
            }

            return await createGroup(input)
        }),
        
    
    getGroupById: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getGroupById(input)
        }),

    getAllCategories: publicProcedure
        .query(async () => {
            return await prisma.category.findMany()
        }),

    getGroupImagePath: publicProcedure
        .input(getGroupImagePathSchema)
        .query(async ({ input }) => {            
            const group = await prisma.telegramGroup.findFirst({
                where: {
                    id: input
                }
            })

            if(!group){
                throw new TRPCError({
                    code:       "BAD_REQUEST",
                    message:    "Grupo não encontrado"         
                })
            }     
            
                                
            return group.imageUrl
        }),


        getPageGroups: publicProcedure
        .input(pagedGroupsSchema)
        .query(async ({ input }) => {
            const { page, elements } = input;
    
            try {
                // Paginate the groups, using skip and take
                const groups = await prisma.telegramGroup.findMany({
                    skip: (page - 1) * elements,  // Skip the previous pages
                    take: elements,               // Limit to the number of elements per page
                    orderBy: [
                        // Prioritize groups with subscriptionPlan.price > 0
                        {
                            subscriptionPlan: {
                                price: 'asc',  // Groups with a higher price first
                            },
                        },
                        {
                            createdAt: 'asc',  // Then order by creation date
                        },
                    ],
                    include: {
                        subscriptionPlan: true,  // Make sure to include the subscriptionPlan data
                    },
                });
    
                // Get the total number of groups for pagination metadata
                const totalGroups = await prisma.telegramGroup.count();
    
                // Return groups along with total count for pagination
                return {
                    groups,
                    totalCount: totalGroups,
                };
            } catch {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while fetching groups.",
                });
            }
        }),


    getAllGroups: requireAuthProcedure.query(async () => await getAllGroups())
    
});

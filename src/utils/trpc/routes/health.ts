import prisma from "@/db/prisma";
import t from "../context";
import { superAdminAuthProcedure } from "../procedures";
import axios, { HttpStatusCode } from "axios";
import { z } from "zod";

const AnualNewMembersSchema = z.number().min(2000).max(new Date().getFullYear()).int();
const AnualRevenueSchema = z.number().min(2000).max(new Date().getFullYear());

export const healthRouter = t.router({
    botStatus: 
        superAdminAuthProcedure
        .query(async () => {
            const response: Response = await axios.post("https://tg-promote-bot-srv.onrender.com")                        
            if( response.status != HttpStatusCode.Ok ) {
                return {
                    name:   "IBOT",
                    status: "não ativo"
                }
            }

            return {
                name:   "IBOT",
                status: "ativo"
            }
        }),

    
    totalUsers:         superAdminAuthProcedure.query(async () => await prisma.user.count()),
    totalRevenue:       superAdminAuthProcedure.query(async () => (await prisma.payment.aggregate({ _sum: { amount: true } }))._sum.amount),
    activeGroups:       superAdminAuthProcedure.query(async () => await prisma.telegramGroup.count()),  
    monthlyRevenue: superAdminAuthProcedure.query(async () => {
        const revenue = await prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            paidAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Início do mês atual
            },
        },
        });
        return revenue._sum.amount || 0;
    }),
    monthlyNewMembers: superAdminAuthProcedure.query(async () => {
        const newMembers = await prisma.groupMember.count({
          where: {
            joinedAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Início do mês atual
            },
          },
        });
        return newMembers;
      }),    
    
      annualNewMembers: superAdminAuthProcedure.input(AnualNewMembersSchema).query(async ({ input }) => {
        const year = input; // Recebe o ano como parâmetro de entrada
    
        // Para o ano passado, pegamos o intervalo de janeiro a dezembro do ano fornecido
        const startDate = new Date(year, 0, 1); // Janeiro do ano passado
        const endDate = new Date(year, 11, 31); // Dezembro do ano passado
    
        // Consulta para obter todos os usuários criados no ano, agrupados por mês
        const newMembersByMonth = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
    
        // Organiza os resultados por mês
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            // Filtra os novos membros para o mês específico
            const monthData = newMembersByMonth.filter(
                (user) => new Date(user.createdAt).getMonth() === i
            );
            return {
                month: i + 1,
                newMembers: monthData.length, // Contagem de usuários por mês
            };
        });
    
        return monthlyData;
    }),
    
    
    annualRevenue: superAdminAuthProcedure.input(AnualRevenueSchema).query(async ({ input }) => {        
        const year = input;
        
        // Consulta para obter o faturamento por mês no ano especificado
        const revenueData = await prisma.payment.groupBy({
        by: ['paidAt'],
        where: {
            paidAt: {
            gte: new Date(`${year}-01-01`), // Início do ano
            lte: new Date(`${year}-12-31`),  // Fim do ano
            },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            paidAt: 'asc',
        },
        });

        // Agrupar faturamento por mês
        const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const monthData = revenueData.filter(data => new Date(data.paidAt).getMonth() + 1 === month);
        
        return {
            month,
            revenue: monthData.reduce((acc, item) => acc + (item._sum.amount || 0), 0), // Somando os valores de pagamento
        };
        });

        return monthlyRevenue;
    })
})

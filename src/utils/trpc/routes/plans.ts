import prisma from "@/db/prisma";
import t from "../context";
import { requireAuthProcedure } from "../procedures";
import { z } from "zod";
import { SubscriptionPlan } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { MercadoPagoPaymentService } from "@/lib/payments/services/mp";
import { IPaymentResponse } from "@/types/BasePaymentService";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";


const getPlanSchema = z.object({
    planId:     z.string(),
    groupId:    z.string(),
    duration:   z.number()
        .min(1, "Duração minima de 1 dia")
        .max(30, "Duração máxima de 30 dias")
        .nonnegative(),

})

export const plansRouter = t.router({
    getPlans: 
        requireAuthProcedure
        .query(async () => {
            return await prisma.subscriptionPlan.findMany()
        }),



    getPlanPayment:
        requireAuthProcedure
        .input(getPlanSchema)
        .mutation(async ({ input, ctx }) => {
            const subscriptionPlan: SubscriptionPlan | null = await prisma.subscriptionPlan.findFirst({
                where: { id: input.planId }
            })

            if(!subscriptionPlan || !ctx.user) {
                throw new TRPCError({
                    code:       "NOT_FOUND",
                    message:    "Metodo de pagamento não encontrado"
                })
            }
            /**
             * Obs: isso evita problemas com arredondamento de floats
             * toFixed para pegar 2 numeros apos a virgula, como isso retorna uma string ha necessidade de um parseFloat!
             */
            const pricePerDuration: number = parseFloat(Math.round((subscriptionPlan.price * input.duration * 100) / 100).toFixed(2))
            const mp_srv: MercadoPagoPaymentService = new MercadoPagoPaymentService()            
            const pix_response: IPaymentResponse<PaymentResponse> = await mp_srv.createPixPayment(
                ctx.user.id!,                 
                input.groupId,
                input.planId,
                pricePerDuration,
                ctx.user.email
            )
                                                                        
            const ticket_url:       string | null = pix_response.response.point_of_interaction?.transaction_data?.ticket_url    ?? null
            const qrcode:           string | null = pix_response.response.point_of_interaction?.transaction_data?.qr_code       ?? null
            
            return { ticket_url, qrcode }
        }),

    getGroupWithPlansByGroupId: requireAuthProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await prisma.telegramGroup.findFirst({
                where: { id: input },
                include: {
                    subscriptionPlan: true
                },                
            })
        })

})

import { Payment } from "mercadopago";
import { mercadoPagoClient } from "../clients/mercadopago/mp";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { IPaymentResponse, PaymentOperations } from "@/types/BasePaymentService";
import Jwt from "jsonwebtoken"


export const AppURI:                       string      = process.env.APP_URI                   as string
export const MercadoPagoWebHook:           string      = process.env.MP_WEBHOOK_NOTIFICATION   as string
export const MerpadoPagoWebHookSecret:     string      = process.env.MP_WEBHOOK_SECRET         as string
export const MercadoPagoWebHookToken:      string      = process.env.MP_WEBHOOK_JWT_TOKEN      as string

export class MercadoPagoPaymentService extends PaymentOperations<Payment, PaymentResponse> {
    protected readonly client = mercadoPagoClient

    async createPixPayment(
        userId:     string, 
        groupId:    string, 
        planId:     string,
        amount:     number, 
        email:      string
    ): Promise<IPaymentResponse<PaymentResponse>> {
        const jwt = Jwt.sign(MerpadoPagoWebHookSecret, MercadoPagoWebHookToken)
        
        try {
            const paymentData: PaymentCreateRequest = {
                transaction_amount: amount,
                payment_method_id: "pix",
                notification_url: `${AppURI}/${MercadoPagoWebHook}/${userId}/${groupId}/${planId}`,
                payer: { 
                    email: email 
                },
                metadata: {
                    secret: jwt,
                    userId: userId
                }
            };

            const response: PaymentResponse | null = await this.client.create({ body: paymentData });
            if(response == null) 
                throw new Error("Response is null")

            const { id, transaction_amount, payment_method_id, status, date_created } = response            
            if (!id || !transaction_amount || !payment_method_id || !status || !date_created)
                throw new Error("Bad response of Service :: Mercado Pago")

            return {
                id:             id.toString(),                
                amount:         transaction_amount,
                method:         payment_method_id,
                status:         status,
                createdAt:      new Date(date_created),
                response:       response
            };
        } catch (e: Error | unknown) {            
            throw new Error(`Erro ao criar pagamento PIX: ${e}`);
        }
    }

    
    async getPaymentById(paymentId: string): Promise<PaymentResponse> {
        return await this.client.get({ 
            id: paymentId,
        })
    }
}
import prisma from '@/db/prisma';
import { MercadoPagoPaymentService } from '@/lib/payments/services/mp';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { NextRequest, NextResponse } from 'next/server';

const ApprovePaymentForUserId = async ( 
    userId:     string, 
    groupId:    string,
    planId:     string,
    payment:    PaymentResponse
) => {
    if(payment.status !== "approved") return             
    const { transaction_amount } = payment
    if(!transaction_amount) 
        throw new Error("The payment argument is the wrong type, expected PaymentResponse")
    
    const subscriptionPlan = await prisma.subscriptionPlan.findFirst({ where: { id: planId } })
    if(!subscriptionPlan) 
        throw new Error("Subscription plan in unexistent!")

    
    const paidDays = subscriptionPlan.price !== 0
    ? Math.floor(transaction_amount / subscriptionPlan.price)
    : null

    if(!paidDays)
        throw new Error("subscription plan price is 0! please fix this in the database")

    await prisma.payment.create({
        data: {
            amount: transaction_amount,
            groupId:    groupId,
            userId:     userId
        }
    })
}
const mp_srv: MercadoPagoPaymentService = new MercadoPagoPaymentService();

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string, groupId: string, planId: string }> }) {
    try {
        // Agora acessamos diretamente o userId
        const { userId, groupId, planId } = await params
        const body = await req.json();
        const id = body?.data?.id;        

        if (id) {
            const payment = await mp_srv.getPaymentById(id);
            if (payment.status == "approved")  await ApprovePaymentForUserId(userId, groupId, planId, payment)
        }

        return NextResponse.json({});
    } catch (error) {
        console.log('Erro ao processar o webhook:', error);
        return NextResponse.json({ error: 'Erro no processamento do webhook' }, { status: 500 });
    }
}

// Tipos de status de pagamento
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';


export interface IPaymentResponse<T> {
    id:         string;                   // ID do pagamento gerado pelo Mercado Pago
    status:     string;               // Status do pagamento (approved, pending, rejected, etc.)    
    amount:     number;               // Valor do pagamento
    method:     string;               // Método de pagamento (ex: "pix")
    createdAt:  Date;              // Data de criação do pagamento
    response:   T
}

// Operações base de pagamento
export abstract class PaymentOperations<client_T, response_T>{
    protected readonly client?: client_T;

    //abstract createPayment(data: unknown): Promise<PaymentResponse>;

    abstract createPixPayment(userId: string, groupId: string, planId: string, amount: number, email: string): Promise<IPaymentResponse<response_T>>;
    abstract getPaymentById(paymentId: string): Promise<response_T>;
    //abstract getPaymentStatus(id: string): Promise<PaymentStatus>;
    //abstract getPaymentDetails(id: string): Promise<PaymentResponse>;
    //abstract cancelPayment(id: string): Promise<PaymentResponse>;
    //abstract refundPayment(id: string, amount?: number): Promise<RefundResponse>;
    //abstract capturePayment(id: string): Promise<PaymentResponse>;
    //abstract validatePayment(data: unknown): Promise<boolean>;
    //abstract processWebhook(data: unknown): Promise<void>;
}

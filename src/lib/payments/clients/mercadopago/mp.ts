import { MercadoPagoConfig, Payment } from "mercadopago";


const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '',
});


export const mercadoPagoClient = new Payment(mercadopago);

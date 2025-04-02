import cron from 'node-cron';
import axios from 'axios';
import { NextResponse } from 'next/server';

let isCronJobActive = false;  // Variável para controlar se o cron job já está ativado

const getDateFormatted = () => {
    const date = new Date();

    // Função para adicionar zero à esquerda, caso necessário
    const pad = (num: number): string => num.toString().padStart(2, '0');
    
    // Formatação
    const formattedDate = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} - ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    
    return formattedDate;
}
const CheckBot = async () => {
    console.log(`[${getDateFormatted()}] | Checando bot...`);
    try {
        const response = await axios.get("https://tg-promote-bot-srv.onrender.com");
        console.warn(`[${getDateFormatted()}] | BOT-STATUS::[${response.data.success ?? 'INATIVO'}]`);
    } catch (error) {
        console.error(`[${getDateFormatted()}] | Erro ao verificar o bot: ${error}`);
    }
}

// Exportar a função para o método GET
export async function GET() {    
    // Verificar se o cron job já foi ativado
    if (!isCronJobActive) {
        console.log("Ativando o cron job");        
        cron.schedule('*/10 * * * *', async () => {
            try {
                console.log('Requisição feita a cada 1 minuto');
                await CheckBot();
            } catch (error) {
                console.error('Erro ao executar a tarefa do cron job:', error);
            }
        });

        // Marcar que o cron job foi ativado
        isCronJobActive = true;

        return NextResponse.json({ message: 'Cron job agendado e ativo' });
    }

    return NextResponse.json({ message: 'Cron job já está ativo' });
}

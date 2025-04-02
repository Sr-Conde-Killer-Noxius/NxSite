import { NextRequest, NextResponse } from "next/server";
import { MonitorPipeline } from "./MonitorPipeline";
import { MiddlewarePipeline } from "./MiddlewarePipeline";
import { SecurityPipeline } from "./SafetyPipeline";
import { isDev, logIfDev } from "./utils.middleware";



function createErrorResponse(status: number, code: string, message: string): NextResponse {
    return new NextResponse(JSON.stringify({ error: message, code }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

// Criando a estrutura de pipeline dinâmica

const pipelines: MiddlewarePipeline<NextResponse | null>[] = [
    SecurityPipeline,
    MonitorPipeline
];

const serverResponses: number[] = [];

export async function RunMiddlewarePipeline(req: NextRequest): Promise<NextResponse> {    
    logIfDev(`🔹 [Url(${req.nextUrl.pathname})]::[MIDDLEWARE] Iniciando processamento da requisição`);
    const startTime = performance.now();

    try {
        // 🚨 Validação inicial da requisição
        if (!req || !req.method || !req.headers || !req.nextUrl) {
            console.error("❌ Erro: Requisição inválida recebida.");
            return createErrorResponse(400, "REQ_400", "Requisição inválida.");
        }

        // 🚨 Verifica se o método HTTP é suportado
        const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
        if (!allowedMethods.includes(req.method.toUpperCase())) {
            logIfDev(`⚠️ Método HTTP não permitido: ${req.method}`);
            return createErrorResponse(405, "REQ_405", "Método HTTP não permitido.");
        }

        // 🚀 Executando todas as pipelines em paralelo
        const results = await Promise.allSettled(pipelines.map(pipeline => pipeline.execute(req)));

        for (let i = 0; i < results.length; i++) {
            // const result    = results[i];
            // const pipeline  = pipelines[i];

            //if (result.status === "fulfilled" && result.value && pipeline.stopOnFirstResponse) {
            //    logIfDev(`[[ ERRO ]] [PIPELINE::${pipeline.repr}] >> retornando valor`)
            //    return result.value;
            //}
        }

    } catch (error) {
        console.error("❌ Erro inesperado no middleware:", error);
        return createErrorResponse(500, "MID_500", "Erro interno no middleware.");
    }

    if(isDev) {
        // 🚀 Calculando tempo de execução
        const endTime   = performance.now();
        const duration  = Math.round(endTime - startTime);
        serverResponses.push(duration);

        const serverMean = Math.round(
            serverResponses.reduce((sum, value) => sum + value, 0) / serverResponses.length
        );
        
        logIfDev("======================================================");
        logIfDev(`✅ [MIDDLEWARE] Todos os middlewares foram aprovados`);
        logIfDev(`➡️ [ TOTAL ] Tempo total:           ${duration}ms`);
        logIfDev(`➡️ [ TOTAL ] Tempo médio servidor:  ${serverMean}ms`);
    }

    // 🏁 Retorna resposta final, passando para o próximo handler
    return NextResponse.next()
}
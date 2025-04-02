import { NextResponse } from "next/server";
import { CheckRateLimit } from "./security/CheckRateLimit";
import { CheckRouteProtection } from "./security/CheckRouteProtection";
import { CheckBlacklist } from "./security/CheckBlackListIP";
import { CheckUserAgent } from "./security/CheckUserAgent";
import { CheckCORS } from "./security/CheckCORS";
import { CheckHTTPS } from "./security/CheckHTTPS";
import { CheckCSRF } from "./security/CheckCsrf";
import { CheckSanitizeInput } from "./security/CheckSanitizeInput";
import { CheckBotTraffic } from "./security/CheckBotTraffic";

import { MiddlewareFunction, MiddlewarePipeline } from "./MiddlewarePipeline";

export const isDev = process.env.NODE_ENV === "development";

// Middlewares concorrentes (executados em paralelo)
const concurrentMiddlewares: Readonly<MiddlewareFunction[]> = [
    CheckBlacklist,
    CheckUserAgent,
    CheckHTTPS,
    CheckBotTraffic,
];

// Middlewares ordenados (executados em sequência)
const orderedMiddlewares: Readonly<MiddlewareFunction[]> = [
    CheckSanitizeInput,
    CheckCORS,
    CheckRateLimit,
    CheckCSRF,
    CheckRouteProtection,
];

// Criando a pipeline de segurança
export const SecurityPipeline: MiddlewarePipeline<NextResponse | null> = new MiddlewarePipeline<NextResponse | null>(
    "Safety",
    concurrentMiddlewares,
    orderedMiddlewares,
    true // Interrompe a execução se um middleware retornar resposta
);
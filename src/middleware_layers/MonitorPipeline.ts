import { NextResponse } from "next/server";
import { MiddlewareFunction, MiddlewarePipeline } from "./MiddlewarePipeline";
import { MonitorLatency } from "./monitor/MonitorLatency";



// Middlewares concorrentes (executados em paralelo)
const concurrentMiddlewares: Readonly<MiddlewareFunction[]> = [
    MonitorLatency

];

// Middlewares ordenados (executados em sequência)
const orderedMiddlewares: Readonly<MiddlewareFunction[]> = [
];

// Criando a pipeline de segurança
export const MonitorPipeline: MiddlewarePipeline<NextResponse | null> = new MiddlewarePipeline<NextResponse | null>(
    "Monitor",
    concurrentMiddlewares,
    orderedMiddlewares,
    false
);
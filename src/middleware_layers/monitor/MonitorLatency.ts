import { NextRequest, NextResponse } from "next/server";

const LATENCY_THRESHOLD_MS = 500; // Tempo máximo aceitável (500ms)

export async function MonitorLatency(req: NextRequest): Promise<NextResponse> {
    const start = Date.now();
    const response = await NextResponse.next();
    const duration = Date.now() - start;

    if (duration > LATENCY_THRESHOLD_MS) {
        console.warn(`Requisição lenta detectada: ${duration}ms - ${req.nextUrl.pathname}`);
    }

    return response;
}

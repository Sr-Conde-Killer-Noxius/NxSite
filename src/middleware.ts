import { MiddlewareConfig, NextRequest }    from "next/server";
import { NextResponse }                     from "next/server";
import { RunMiddlewarePipeline } from "./middleware_layers/CreatePipeline";


// Middleware principal
export async function middleware(req: NextRequest): Promise<NextResponse> {          
    return await RunMiddlewarePipeline(req);    
}

// Configuração do Middleware para capturar todas as rotas
export const config: MiddlewareConfig = {
    matcher: "/:path*",
};

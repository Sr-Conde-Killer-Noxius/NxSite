import { NextRequest, NextResponse } from "next/server";
//import crypto from "crypto";

// Obtém o segredo CSRF da variável de ambiente
// const CSRF_SECRET: string = process.env.CSRF_SECRET ?? "";
// if (!CSRF_SECRET) {
//     throw new Error("Expected CSRF_SECRET in environment variables!");
// }

// Gera um token CSRF usando HMAC e um timestamp
// function generateCSRFToken(): string {
//     return crypto.createHmac("sha256", CSRF_SECRET).update(Date.now().toString()).digest("hex");
// }

// Middleware para verificar o token CSRF
export async function CheckCSRF(): Promise<NextResponse | null> {    
    return null 
    // NOT IMPLEMENTED YET IN THE FRONTEND
    // if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    //     return null; // Métodos seguros não precisam de CSRF
    // }
    // 
    // const csrfToken = req.headers.get("x-csrf-token");
    // 
    // if (!csrfToken) {
    //     return new NextResponse(JSON.stringify({ error: "CSRF token ausente!" }), {
    //         status: 403,
    //         headers: { "Content-Type": "application/json" },
    //     });
    // }
    // 
    // // Valida o token CSRF gerando um novo e comparando
    // const validToken = generateCSRFToken();
    // if (csrfToken !== validToken) {
    //     return new NextResponse(JSON.stringify({ error: "CSRF token inválido!" }), {
    //         status: 403,
    //         headers: { "Content-Type": "application/json" },
    //     });
    // }
    //
    // return null;
}

import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

export async function CheckSanitizeInput(req: NextRequest): Promise<NextResponse | null> {
    if (req.method === "POST" || req.method === "PUT") {
        const body = await req.json().catch(() => null);
        if (!body) {
            return new NextResponse(JSON.stringify({ error: "Requisição inválida." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Sanitiza todos os valores do JSON
        const sanitizedBody = JSON.parse(JSON.stringify(body), (_, value) =>
            typeof value === "string" ? sanitizeHtml(value) : value
        );

        // Se a sanitização removeu algo suspeito, podemos bloquear a requisição
        if (JSON.stringify(body) !== JSON.stringify(sanitizedBody)) {
            return new NextResponse(JSON.stringify({ error: "Entrada contém caracteres inválidos." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    return null; // Prossegue para os próximos middlewares
}

import { NextRequest, NextResponse } from "next/server";
import { applyPenalty } from "./CheckBlackListIP";

const BLOCKED_USER_AGENTS: ReadonlyArray<string> = [
    "Python-urllib", 
    "curl", 
    "wget", 
    "PostmanRuntime", 
    "Scrapy", 
    "bot", 
    "spider", 
    "crawler"
];

export async function CheckBotTraffic(req: NextRequest): Promise<NextResponse | null> {    
    const userAgent = req.headers.get("user-agent") || "";

    if (BLOCKED_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))) {
        const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";    
        console.warn(`Bot detectado e bloqueado: ${userAgent}`);
        if(ip !== "unkown") {
            applyPenalty(ip)
        }
        return new NextResponse(JSON.stringify({ error: "Acesso negado." }), { status: 403 });
    }

    return null;
}

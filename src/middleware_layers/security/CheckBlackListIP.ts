import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";

const penaltyCache = new NodeCache(); // Cache global

// Penalidades em segundos (30min, 2h, 12h)
const PENALTY_TIMES = [
    30 * 60, 
    2 * 60 * 60, 
    12 * 60 * 60
];

export function applyPenalty(ip: string) {
    const currentPenalty = penaltyCache.get<number>(ip) || 0;
    const newPenaltyIndex = Math.min(currentPenalty, PENALTY_TIMES.length - 1); // Garante que não estoure o índice
    const penaltyTime = PENALTY_TIMES[newPenaltyIndex];

    penaltyCache.set(ip, newPenaltyIndex + 1, penaltyTime);
}

export function isIPBlocked(ip: string): boolean {
    return penaltyCache.has(ip);
}



export async function CheckBlacklist(req: NextRequest): Promise<NextResponse | null> {        
    const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";    

    if (isIPBlocked(ip)) {
        return NextResponse.json({ error: "Access denied due to repeated violations" }, { status: 403 });
    }
    
    return null;
}

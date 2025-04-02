import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";
import { isNextRoute } from "./CheckRouteProtection";
import { applyPenalty } from "./CheckBlackListIP";

const RATE_LIMIT:   number = 100;    // Maximo de req / min 
const TIME_WINDOW:  number = 60;    // Janela de tempo em segundods
const cache = new NodeCache({
    stdTTL:         TIME_WINDOW,
    checkperiod:    TIME_WINDOW / 2,
})


/**
 * Checks if an IP has exceeded the rate limit.
 * @param req NextRequest object
 * @returns NextResponse | null (null means continue processing the request)
 */
export async function CheckRateLimit(req: NextRequest): Promise<NextResponse | null> {
    if(isNextRoute(req.nextUrl.pathname)) return null
    const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const requestCount = (cache.get<number>(ip) || 0) + 1;
    cache.set(ip, requestCount);

    console.log(`IP[${ip}] >> ${requestCount}`)

    if (requestCount > RATE_LIMIT) {
        console.warn(`Blocking IP ${ip} due to excessive requests`);

        applyPenalty(ip)
        return new NextResponse("Too many requests", { status: 429 });
    }

    return null; // No limit exceeded, continue processing
}
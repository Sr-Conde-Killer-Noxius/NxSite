import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS: Set<string> = new Set([
    `${process.env.APP_URI}`,    
]);

export async function CheckCORS(req: NextRequest): Promise<NextResponse | null> {
    const origin: string = req.headers.get("origin") ?? "";    
    return null 
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
        return NextResponse.json({ error: "CORS policy violation" }, { status: 403 });
    }

    return null;
}

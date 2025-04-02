import { NextRequest, NextResponse } from "next/server";

export async function CheckUserAgent(req: NextRequest): Promise<NextResponse | null> {
    const userAgent = req.headers.get("user-agent") || "";

    if (!userAgent || /bot|crawler|spider|scraper/i.test(userAgent)) {
        return NextResponse.json({ error: "Bots not allowed" }, { status: 403 });
    }

    return null;
}

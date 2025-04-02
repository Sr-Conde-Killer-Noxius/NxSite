import { NextRequest, NextResponse } from "next/server";
import { isDev } from "../utils.middleware";

export async function CheckHTTPS(req: NextRequest): Promise<NextResponse | null> {        
    if (!isDev && req.headers.get("x-forwarded-proto") !== "https") {
        const httpsUrl = new URL(req.url);
        httpsUrl.protocol = "https:";
        return NextResponse.redirect(httpsUrl.toString(), 301);
    }

    return null;
}

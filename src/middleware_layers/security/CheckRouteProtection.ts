import Jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "@/utils/trpc/routes/auth";
import { NextRequest, NextResponse } from "next/server";



export type     SupportedLanguages_t                        = 'ptBr' | 'en';
export const    SupportedLanguages: SupportedLanguages_t[]  = ["en", "ptBr"]; // Teste com valores fixos


// Rotas públicas e privadas
/** @TODO rewrite the trpc client */
const sitePrivateRoutes:    string[]    = []
const siteRoutes:           string[]    = ["/", "/register", "/login", "/how-submit-a-group", "/search", "/dashboard"];
const nextRoutes:           string[]    = ["/api/", "/auth/", "/_next/static/", "/_next/image/", "/favicon.ico"];


// Definição de rotas privadas dentro de cada idioma
const privateRoutes = SupportedLanguages.flatMap(lang => 
    sitePrivateRoutes.map(route => `/${lang}${route}`)
);



// Criamos um Set para armazenar as rotas públicas (melhora a performance)
const publicRoutes = new Set([
    ...nextRoutes,
    ...SupportedLanguages.flatMap(lang => siteRoutes.map(route => `/${lang}${route}`))
]);

export function isNextRoute(pathname: string): boolean {
    return nextRoutes.some(route => pathname.startsWith(route))
}
// Função para verificar se a rota é pública
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.has(pathname) || isNextRoute(pathname);
}

// Função para verificar se a rota é privada
function isPrivateRoute(pathname: string): boolean {    
    return privateRoutes.some(route => pathname.startsWith(route));
}

function extractSiteLanguage(url: string) {
    try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        
        // Ensure there's at least one path segment
        if (pathSegments.length > 0) {
            return pathSegments[0];
        }
    } catch (error) {
        console.error("Invalid URL:", error);
    }
    
    return "ptBr"; // Default fallback
}


export async function CheckRouteProtection(req: NextRequest): Promise<NextResponse | null> {
    // Se for uma rota pública, permitir acesso sem autenticação
        if (isPublicRoute(req.nextUrl.pathname)) {        
            return null
        }
    
        // Se for uma rota privada, exigir autenticação
        if (isPrivateRoute(req.nextUrl.pathname)) {        
            let token = req.cookies.get("auth-token")?.value;    
            
            if (!token) {                                    
                const authHeader = req.headers.get("Authorization")
                if(authHeader && authHeader?.startsWith("Bearer ")) {
                    token = authHeader.split(" ")[1]
                }            
            }
                    
            if(!token) {            
                const siteLanguage = extractSiteLanguage(req.url)                        
                return NextResponse.redirect(new URL(`/${siteLanguage}/forbiden_access`, req.url));
            }
    
            try {
                if(!token) throw Error("Token not found")            
                Jwt.verify(token, JWT_SECRET);
                return null
                
            } catch {            
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }
    
        return null
}
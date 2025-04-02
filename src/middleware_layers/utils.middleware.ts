export const isDev = process.env.NODE_ENV === "development";

export function logIfDev(message: string) {
    if (isDev) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString("pt-BR", { hour12: false }) + `:${now.getMilliseconds()}`;
        console.log(`[${timestamp}] ${message}`);
    }
}
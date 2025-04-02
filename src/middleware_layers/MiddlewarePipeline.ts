import { NextRequest, NextResponse } from "next/server";

// Definição do tipo de função de middleware genérica
export type MiddlewareFunction<RetType = NextResponse | null> = (req: NextRequest) => Promise<RetType>;

export class MiddlewarePipeline<RetType = NextResponse | null> {
    public  repr: string = "unkown"
    private concurrentMiddlewares:  readonly MiddlewareFunction<RetType>[];
    private orderedMiddlewares:     readonly MiddlewareFunction<RetType>[];
    public  stopOnFirstResponse: boolean;

    constructor(
        repr: string,
        concurrentMiddlewares:  readonly MiddlewareFunction<RetType>[],
        orderedMiddlewares:     readonly MiddlewareFunction<RetType>[],
        stopOnFirstResponse: boolean = true
    ) {
        this.repr = repr
        this.concurrentMiddlewares  = concurrentMiddlewares;
        this.orderedMiddlewares     = orderedMiddlewares;
        this.stopOnFirstResponse    = stopOnFirstResponse;
    }

    private async executeConcurrent(req: NextRequest): Promise<RetType | null> {
        const results = await Promise.allSettled(
            this.concurrentMiddlewares.map(middleware => middleware(req))
        );

        for (const result of results) {
            if (result.status === "fulfilled" && result.value && this.stopOnFirstResponse) {                
                return result.value;
            }
        }
        return null;
    }
    
    private async executeOrdered(req: NextRequest): Promise<RetType | null> {
        for (const middleware of this.orderedMiddlewares) {
            try {
                const response = await middleware(req);
                if (response && this.stopOnFirstResponse) {
                    return response;
                }
            } catch (error) {
                console.error(`Erro no middleware ${middleware.name}:`, error);
            }
        }
        return null;    
    }

    async execute(req: NextRequest): Promise<RetType | null> {
        const concurrentResult = await this.executeConcurrent(req);
        if (concurrentResult !== null && this.stopOnFirstResponse) return concurrentResult;

        const orderedResult = await this.executeOrdered(req);
        if (orderedResult !== null && this.stopOnFirstResponse) return orderedResult;

        return null;
    }
}

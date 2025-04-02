
import { createContext } from "@/utils/trpc/context";
import { appRouter } from "@/utils/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    router: appRouter,
    createContext: async () => createContext(req),
    req,
    endpoint: "/api/trpc",
  });
};


// Remova o runtime "edge" e deixe a Vercel decidir qual usar
export { handler as GET, handler as POST };

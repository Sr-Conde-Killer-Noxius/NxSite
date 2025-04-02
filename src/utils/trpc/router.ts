import t from "./context";
import { userRouter }     from "@/utils/trpc/routes/user";
import { groupsRouter }   from "@/utils/trpc/routes/groups";
import { authRouter }     from "@/utils/trpc/routes/auth";
import { plansRouter }    from "@/utils/trpc/routes/plans";
import { healthRouter }   from "@/utils/trpc/routes/health";
import { ticketsRouter }  from "@/utils/trpc/routes/tickets";

export const appRouter = t.router({
  user:         userRouter,
  groups:       groupsRouter,
  auth:         authRouter,
  plans:        plansRouter,

  tickets:      ticketsRouter,

  health:       healthRouter
});

export type AppRouter = typeof appRouter;
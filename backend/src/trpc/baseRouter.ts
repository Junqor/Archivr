import * as trpcExpress from "@trpc/server/adapters/express";
import { listsRouter } from "./procedures/lists.js";
import { createContext, router } from "./init.js";

const appRouter = router({
  lists: listsRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

import * as trpcExpress from "@trpc/server/adapters/express";
import { listsRouter } from "./procedures/lists.js";
import { createContext, router } from "./init.js";
import { followsRouter } from "./procedures/follows.js";

const appRouter = router({
  lists: listsRouter,
  follows: followsRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

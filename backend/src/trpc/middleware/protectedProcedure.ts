import { TRPCError } from "@trpc/server";
import { logger } from "../../configs/logger.js";
import { publicProcedure } from "../init.js";

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || typeof ctx.user !== "object") {
    logger.info("Missing access token");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

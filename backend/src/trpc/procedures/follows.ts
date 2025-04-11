import { z } from "zod";
import { protectedProcedure } from "../middleware/protectedProcedure.js";
import { db } from "../../db/database.js";
import { activity, follows, lists, users } from "../../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { router } from "../init.js";
import { TRPCError } from "@trpc/server";

export const followsRouter = router({
  checkIfFollowing: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      const rows = await db
        .select()
        .from(follows)
        .where(
          and(
            eq(follows.followerId, user.id), // The users follows
            eq(follows.followeeId, id) // Filter to find the user's follows
          )
        );
      return rows[0] ? true : false;
    }),

  follow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      if (user.id === id) {
        throw new TRPCError({
          message: "You can't follow yourself",
          code: "BAD_REQUEST",
        });
      }
      return db.transaction(async (tx) => {
        const result = await tx
          .insert(follows)
          .values({ followerId: user.id, followeeId: id })
          .onDuplicateKeyUpdate({ set: { followerId: user.id } })
          .$returningId();

        if (result.length === 0 || result[0].id === 0) {
          return;
        }

        await tx.insert(activity).values({
          userId: user.id,
          targetId: id,
          activityType: "follow",
        });
      });
    }),

  unfollow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      return db.transaction(async (tx) => {
        await tx
          .delete(follows)
          .where(
            and(eq(follows.followerId, user.id), eq(follows.followeeId, id))
          );
      });
    }),
});

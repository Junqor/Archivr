import { z } from "zod";
import { protectedProcedure } from "../middleware/protectedProcedure.js";
import { db } from "../../db/database.js";
import { likes, lists, media, ratings, users } from "../../db/schema.js";
import { eq, and, sql, getTableColumns, count, avg } from "drizzle-orm";
import { publicProcedure, router } from "../init.js";

export const listsRouter = router({
  getUsersMediaList: protectedProcedure // Get specific user's media list
    .input(z.object({ mediaId: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      const { mediaId } = input;
      const rows = await db
        .select()
        .from(lists)
        .where(and(eq(lists.user_id, user.id), eq(lists.media_id, mediaId)));
      return rows[0] || null;
    }),
  updateMediaList: protectedProcedure
    .input(
      z.object({
        mediaId: z.coerce.number(),
        listName: z.enum(["completed", "watching", "planning"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      const { mediaId, listName } = input;
      return db.transaction(async (trx) => {
        // TODO: maybe add activity for this
        await trx
          .insert(lists)
          .values({ user_id: user.id, media_id: mediaId, list_name: listName })
          .onDuplicateKeyUpdate({
            set: { list_name: listName, updated_at: sql`CURRENT_TIMESTAMP()` },
          });
      });
    }),
  removeFromList: protectedProcedure
    .input(
      z.object({
        mediaId: z.coerce.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { mediaId } = input;

      return db.transaction(async (tx) => {
        await tx
          .delete(lists)
          .where(and(eq(lists.media_id, mediaId), eq(lists.user_id, user.id)));
      });
    }),

  // Get all media in one of the lists for a user
  getLists: publicProcedure
    .input(
      z.object({
        userName: z.string(),
        listType: z.enum(["completed", "watching", "planning"]),
      })
    )
    .query(async ({ input }) => {
      const { userName, listType } = input;

      return db
        .select({
          ...getTableColumns(media),
          id: media.id,
          likes: count(likes.id),
          userRating: avg(ratings.rating),
        })
        .from(lists)
        .innerJoin(users, eq(users.username, userName))
        .innerJoin(media, eq(media.id, lists.media_id))
        .leftJoin(likes, eq(likes.mediaId, media.id))
        .leftJoin(ratings, eq(ratings.mediaId, media.id))
        .where(and(eq(lists.user_id, users.id), eq(lists.list_name, listType)))
        .groupBy(media.id);
    }),
});

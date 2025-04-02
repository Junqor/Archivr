import { z } from "zod";
import { protectedProcedure } from "../middleware/protectedProcedure.js";
import { db } from "../../db/database.js";
import { lists } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { router } from "../init.js";

export const listsRouter = router({
  getAllLists: protectedProcedure
    .input(z.object({ mediaId: z.coerce.number() }))
    .query(async ({ ctx }) => {
      const user = ctx.user;
      return db.select().from(lists).where(eq(lists.user_id, user.id));
    }),
});

import { db } from "../../db/database.js";
import { activity, follows } from "../../db/schema.js";
import { desc, eq, inArray } from "drizzle-orm/expressions";

export const getGlobalActivity = async (page: number) => {
  const PAGESIZE = 15;
  const rows = await db
    .select()
    .from(activity)
    .orderBy(desc(activity.createdAt))
    .limit(PAGESIZE)
    .offset(page * PAGESIZE);
  return rows;
};

export const getFollowingActivity = async (userId: number, page: number) => {
  const PAGESIZE = 15;
  const following = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId));
  const followeeIds = following.map((f) => f.followeeId);
  const recentActivity = await db
    .select()
    .from(activity)
    .where(inArray(activity.userId, followeeIds))
    .orderBy(desc(activity.createdAt))
    .limit(PAGESIZE)
    .offset(page * PAGESIZE);

  return recentActivity;
};

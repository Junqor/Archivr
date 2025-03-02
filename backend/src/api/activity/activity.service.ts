import { aliasedTable, avg, sql, sum } from "drizzle-orm";
import { db } from "../../db/database.js";
import {
  activity,
  follows,
  media,
  ratings,
  userReviews,
  users,
} from "../../db/schema.js";
import { and, desc, eq, inArray, or } from "drizzle-orm/expressions";
import { logger } from "../../configs/logger.js";

const PAGESIZE = 15;
const usersAliased = aliasedTable(users, "usersAliased");
function returnBaseQuery() {
  return db
    .select({
      activity: {
        id: activity.id,
        userId: activity.userId,
        activityType: activity.activityType,
        targetId: activity.targetId,
        relatedId: activity.relatedId,
        content: activity.content,
        createdAt: activity.createdAt,
      },
      media: {
        id: media.id,
        title: media.title,
        thumbnail_url: media.thumbnail_url,
        rating: media.rating,
      },
      user: {
        username: users.username,
        avatar_url: users.avatarUrl,
        role: users.role,
        display_name: users.displayName,
      },
      review: {
        rating: ratings.rating,
        reviewText: userReviews.comment,
        created_at: userReviews.createdAt,
        mediaId: userReviews.mediaId,
      },
      followee: {
        username: usersAliased.username,
        avatar_url: usersAliased.avatarUrl,
        role: usersAliased.role,
      },
    })
    .from(activity)
    .leftJoin(
      media,
      or(
        and(
          eq(activity.activityType, "like_review"),
          eq(media.id, activity.relatedId)
        ),
        and(
          eq(activity.activityType, "like_media"),
          eq(media.id, activity.targetId)
        ),
        and(
          eq(activity.activityType, "review"),
          eq(media.id, activity.targetId)
        )
      )
    )
    .leftJoin(users, eq(users.id, activity.userId))
    .leftJoin(
      usersAliased,
      or(
        and(
          eq(activity.activityType, "follow"),
          eq(usersAliased.id, activity.targetId)
        )
      )
    )
    .leftJoin(
      userReviews,
      or(
        and(
          eq(activity.activityType, "review"),
          and(
            eq(users.id, userReviews.userId),
            eq(activity.targetId, userReviews.mediaId)
          )
        ),
        and(
          eq(activity.activityType, "like_review"),
          and(eq(activity.targetId, userReviews.id))
        )
      )
    )
    .leftJoin(
      ratings,
      and(
        eq(activity.activityType, "review"),
        and(eq(ratings.id, activity.relatedId))
      )
    );
}

export const getGlobalActivity = async (page: number) => {
  const rows = await returnBaseQuery()
    .orderBy(desc(activity.createdAt))
    .limit(PAGESIZE)
    .offset(page * PAGESIZE);
  return rows;
};

export const getFollowingActivity = async (userId: number, page: number) => {
  const following = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId));
  const followeeIds = following.map((f) => f.followeeId);
  const recentActivity = await returnBaseQuery()
    .where(inArray(activity.userId, followeeIds))
    .orderBy(desc(activity.createdAt))
    .limit(PAGESIZE)
    .offset(page * PAGESIZE);

  return recentActivity;
};

export const followUser = async (userId: number, followeeId: number) => {
  await db.transaction(async (tx) => {
    const result = await tx
      .insert(follows)
      .values({ followerId: userId, followeeId: followeeId })
      .onDuplicateKeyUpdate({ set: { followerId: userId } })
      .$returningId();
    if (result.length === 0 || result[0].id === 0) return; // If no id is returned, the user is already following the followee
    await tx.insert(activity).values({
      userId: userId,
      targetId: followeeId,
      activityType: "follow",
    });
  });
};

export const getTopUserMedia = async () => {
  const rows = await db
    .select({
      id: media.id,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      userRating: sql<number>`avg(${ratings.rating})`,
    })
    .from(media)
    .leftJoin(ratings, eq(media.id, ratings.mediaId))
    .orderBy(desc(avg(ratings.rating)), desc(media.rating))
    .groupBy(media.id)
    .limit(10);
  return rows;
};

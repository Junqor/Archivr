import { aliasedTable, avg, count, sql, sum, exists } from "drizzle-orm";
import { db } from "../../db/database.js";
import {
  activity,
  follows,
  media,
  ratings,
  userReviews,
  users,
  likesReviews as likesReviewsTable,
  likes,
} from "../../db/schema.js";
import { and, desc, eq, inArray, or } from "drizzle-orm/expressions";
const PAGESIZE = 15;
const usersAliased = aliasedTable(users, "usersAliased");

function createBaseQuery(currentUserId?: number) {
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
        title: media.title,
        thumbnail_url: media.thumbnail_url,
        rating: media.rating,
        release_date: media.release_date,
        like_count: count(likes.id).as("like_count"),
        is_liked: currentUserId
          ? exists(
              db
                .select()
                .from(likes)
                .where(
                  and(
                    eq(likes.mediaId, media.id),
                    eq(likes.userId, currentUserId)
                  )
                )
            )
          : sql`false`,
      },
      user: {
        username: users.username,
        avatar_url: users.avatarUrl,
        role: users.role,
        display_name: users.displayName,
        rating: ratings.rating,
      },
      review: {
        created_at: userReviews.createdAt,
        review_likes: count(likesReviewsTable.id).as("review_likes"),
      },
      followee: {
        username: usersAliased.username,
        display_name: usersAliased.displayName,
        avatar_url: usersAliased.avatarUrl,
        role: usersAliased.role,
      },
      reply: {
        user_id: userReviews.userId,
        username: usersAliased.username,
        role: usersAliased.role,
        avatar_url: usersAliased.avatarUrl,
        display_name: usersAliased.displayName,
        rating: ratings.rating,
      },
    })
    .from(activity)
    .leftJoin(users, eq(users.id, activity.userId))
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
          eq(activity.targetId, userReviews.id)
        ),
        and(
          eq(activity.activityType, "reply"),
          eq(activity.targetId, userReviews.id)
        )
      )
    )
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
        ),
        and(
          eq(activity.activityType, "reply"),
          eq(media.id, activity.relatedId)
        )
      )
    )
    .leftJoin(
      usersAliased,
      or(
        and(
          eq(activity.activityType, "follow"),
          eq(usersAliased.id, activity.targetId)
        ),
        and(
          eq(activity.activityType, "like_review"),
          eq(usersAliased.id, userReviews.userId)
        ),
        and(
          eq(activity.activityType, "reply"),
          eq(usersAliased.id, userReviews.userId)
        )
      )
    )
    .leftJoin(
      ratings,
      and(
        eq(ratings.userId, userReviews.userId),
        eq(ratings.mediaId, userReviews.mediaId)
      )
    )
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(
      likesReviewsTable,
      eq(userReviews.id, likesReviewsTable.reviewId)
    );
}

function mapActivityResults(results: any[]) {
  return results.map((entry) => {
    return {
      activity: entry.activity,
      media: entry.media?.title ? entry.media : undefined,
      user: entry.user,
      review: entry.review?.created_at ? entry.review : undefined,
      followee: entry.followee?.username ? entry.followee : undefined,
      reply: entry.reply?.username ? entry.reply : undefined,
    };
  });
}

export async function getUserActivity(
  user_id: number,
  limit = PAGESIZE,
  offset = 0
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  const userActivity = await createBaseQuery(user_id)
    .where(eq(activity.userId, user_id))
    .groupBy(activity.id, media.id, users.id, userReviews.id, usersAliased.id)
    .orderBy(desc(activity.createdAt))
    .limit(limit)
    .offset(offset);

  return mapActivityResults(userActivity);
}

export async function getGlobalActivity(limit = PAGESIZE, offset = 0) {
  const globalActivity = await createBaseQuery()
    .groupBy(activity.id, media.id, users.id, userReviews.id, usersAliased.id)
    .orderBy(desc(activity.createdAt))
    .limit(limit)
    .offset(offset);

  return mapActivityResults(globalActivity);
}

export async function getFollowingActivity(
  userId: number,
  limit = PAGESIZE,
  offset = 0
) {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user id");
  }

  const following = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId));

  const followeeIds = following.map((f) => f.followeeId);

  if (followeeIds.length === 0) {
    return [];
  }

  const followingActivity = await createBaseQuery(userId)
    .where(inArray(activity.userId, followeeIds))
    .groupBy(activity.id, media.id, users.id, userReviews.id, usersAliased.id)
    .orderBy(desc(activity.createdAt))
    .limit(limit)
    .offset(offset);

  return mapActivityResults(followingActivity);
}

export const followUser = async (userId: number, followeeId: number) => {
  if (userId === followeeId) {
    throw new Error("Users cannot follow themselves");
  }

  const [userExists, followeeExists] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).limit(1),
    db.select().from(users).where(eq(users.id, followeeId)).limit(1),
  ]);

  if (userExists.length === 0) {
    throw new Error("User does not exist");
  }

  if (followeeExists.length === 0) {
    throw new Error("Followee does not exist");
  }

  await db.transaction(async (tx) => {
    const result = await tx
      .insert(follows)
      .values({ followerId: userId, followeeId: followeeId })
      .onDuplicateKeyUpdate({ set: { followerId: userId } })
      .$returningId();

    if (result.length === 0 || result[0].id === 0) return;

    await tx.insert(activity).values({
      userId: userId,
      targetId: followeeId,
      activityType: "follow",
    });
  });
};

export const getTopUserMedia = async (limit = 10) => {
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
    .orderBy(
      desc(avg(ratings.rating)),
      desc(count(ratings.rating)),
      desc(media.rating)
    )
    .groupBy(media.id)
    .limit(limit);

  return rows;
};

export const getUserTopMedia = async (userId: number, limit = 10) => {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user id");
  }

  const rows = await db
    .select({
      id: media.id,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      userRating: ratings.rating,
      ratedAt: ratings.ratedAt,
    })
    .from(media)
    .leftJoin(ratings, eq(media.id, ratings.mediaId))
    .where(eq(ratings.userId, userId))
    .orderBy(desc(avg(ratings.rating)), desc(ratings.ratedAt))
    .groupBy(media.id, ratings.ratedAt)
    .limit(limit);

  return rows;
};

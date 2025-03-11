import { db } from "../../db/database.js";
import {
  userReviews,
  likesReviews as likesReviewsTable,
  ratings,
  activity,
  Replies,
  media,
  likes,
} from "../../db/schema.js";
import { desc, asc, eq, and, lte, or } from "drizzle-orm/expressions";
import { UnauthorizedError } from "../../utils/error.class.js";
import { count, avg, sql, isNull, exists } from "drizzle-orm";

export async function updateReview(
  media_id: number,
  user_id: number,
  new_comment: string,
  new_rating: number
) {
  await db.transaction(async (tx) => {
    const [ratingId] = await tx
      .insert(ratings)
      .values({ mediaId: media_id, userId: user_id, rating: new_rating })
      .onDuplicateKeyUpdate({
        set: { rating: new_rating, ratedAt: sql`CURRENT_TIMESTAMP` },
      })
      .$returningId();

    if (new_comment.length > 0) {
      await tx
        .insert(userReviews)
        .values({
          mediaId: media_id,
          userId: user_id,
          comment: new_comment,
          ratingId: ratingId.id,
        })
        .onDuplicateKeyUpdate({
          set: {
            comment: new_comment,
            ratingId: ratingId.id,
            createdAt: sql`CURRENT_TIMESTAMP`,
          },
        });
    }

    // Try to update the review activity
    const rows = await tx
      .update(activity)
      .set({
        content: new_comment,
        createdAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(
        and(eq(activity.userId, user_id), eq(activity.targetId, media_id))
      );

    // If the update was successful, do not insert a new activity
    if (rows[0].affectedRows === 1) {
      return;
    } else if (rows[0].affectedRows > 1) {
      // Just in case
      throw new Error("Multiple review activities found");
    }

    // Insert a new activity
    await tx.insert(activity).values({
      userId: user_id,
      activityType: "review",
      targetId: media_id,
      relatedId: ratingId.id,
      content: new_comment,
    });
  });
  return;
}

export const deleteReview = async (reviewId: number, userId: number) => {
  const [{ reviewUserId, ratingId }] = await db
    .select({
      reviewUserId: userReviews.userId,
      ratingId: userReviews.ratingId,
    })
    .from(userReviews)
    .where(eq(userReviews.id, reviewId));

  // Check if the user is the reviewer
  if (reviewUserId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }
  await db.transaction(async (tx) => {
    await tx.delete(userReviews).where(eq(userReviews.id, reviewId));
    await tx.delete(ratings).where(eq(ratings.id, ratingId));
  });
};

export const deleteReply = async (replyId: number, userId: number) => {
  const [{ replyUserId }] = await db
    .select({ replyUserId: Replies.user_id })
    .from(Replies)
    .where(eq(Replies.id, replyId));

  // Check if the user is the reviewer
  if (replyUserId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  await db.delete(Replies).where(eq(Replies.id, replyId));
};

export const likeReview = async (reviewId: number, userId: number) => {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(likesReviewsTable).values({ userId, reviewId });

      const [{ mediaId }] = await tx
        .select({ mediaId: userReviews.mediaId })
        .from(userReviews)
        .where(eq(userReviews.id, reviewId));
      await tx.insert(activity).values({
        userId,
        activityType: "like_review",
        targetId: reviewId,
        relatedId: mediaId,
      });
    });
  } catch (error) {
    // If the like already exists for this review+user, unlike/delete it
    await db
      .delete(likesReviewsTable)
      .where(
        and(
          eq(likesReviewsTable.reviewId, reviewId),
          eq(likesReviewsTable.userId, userId)
        )
      );
  }
};

export const checkLikes = async (mediaId: number, userId: number) => {
  const rows = await db
    .select({ reviewId: likesReviewsTable.reviewId })
    .from(likesReviewsTable)
    .innerJoin(userReviews, eq(userReviews.id, likesReviewsTable.reviewId))
    .where(
      and(
        eq(userReviews.mediaId, mediaId),
        eq(likesReviewsTable.userId, userId)
      )
    );

  return rows;
};

export const getUserReviewAndRating = async (
  userId: number,
  mediaId: number
) => {
  const rows = await db
    .select({ rating: ratings.rating, review: userReviews.comment })
    .from(ratings)
    .leftJoin(userReviews, eq(ratings.id, userReviews.ratingId))
    .where(and(eq(ratings.userId, userId), eq(ratings.mediaId, mediaId)));

  if (rows.length === 0) {
    return { rating: null, review: null };
  }

  return rows[0];
};

export const addReply = async (
  text: string,
  reviewId: number,
  userId: number
) => {
  //
  await db.transaction(async (tx) => {
    await tx.insert(Replies).values({
      parent_id: reviewId,
      user_id: userId,
      text: text,
    });
    const [{ mediaId }] = await tx
      .select({ mediaId: userReviews.mediaId })
      .from(userReviews)
      .where(eq(userReviews.id, reviewId));
    await tx.insert(activity).values({
      userId: userId,
      activityType: "reply",
      targetId: reviewId,
      relatedId: mediaId,
      content: text,
    });
  });
};

const sortFields = {
  "userReviews.createdAt": userReviews.createdAt,
  "media.title": media.title,
  "media.rating": media.rating,
  "media.release_date": media.release_date,
  "media.runtime": media.runtime,
  "ratings.rating": ratings.rating,
  review_likes: sql`review_likes`,
};

const avgRatingsSubquery = db
  .select({
    mediaId: ratings.mediaId,
    avg_rating: sql`ROUND(${avg(ratings.rating)}, 0)`.as("avg_rating"),
  })
  .from(ratings)
  .groupBy(ratings.mediaId)
  .as("avgRatings");

export async function getUserReviews(
  user_id: number,
  limit = 5,
  offset = 0,
  sort_by: keyof typeof sortFields = "userReviews.createdAt",
  sort_order = "desc",
  ratingMax = 10
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  let orderByClause =
    sort_order === "asc" ? asc(sortFields[sort_by]) : desc(sortFields[sort_by]);

  const reviews = await db
    .select({
      review: {
        id: userReviews.id,
        comment: userReviews.comment,
        review_likes: count(likesReviewsTable.id).as("review_likes"),
        createdAt: userReviews.createdAt,
      },
      media: {
        id: userReviews.mediaId,
        title: media.title,
        release_date: media.release_date,
        thumbnail_url: media.thumbnail_url,
        rating: media.rating,
        avg_rating: avgRatingsSubquery.avg_rating,
        like_count: count(likes.id).as("like_count"),
      },
      user_rating: ratings.rating,
      is_liked: exists(
        db
          .select()
          .from(likes)
          .where(and(eq(likes.mediaId, media.id), eq(likes.userId, user_id)))
      ),
    })
    .from(userReviews)
    .innerJoin(ratings, eq(userReviews.ratingId, ratings.id))
    .innerJoin(media, eq(userReviews.mediaId, media.id))
    .leftJoin(
      avgRatingsSubquery,
      eq(userReviews.mediaId, avgRatingsSubquery.mediaId)
    )
    .leftJoin(likesReviewsTable, eq(userReviews.id, likesReviewsTable.reviewId))
    .leftJoin(likes, eq(userReviews.mediaId, likes.mediaId))
    .where(
      and(
        eq(userReviews.userId, user_id),
        ratingMax < 10
          ? or(lte(ratings.rating, ratingMax), isNull(ratings.rating))
          : sql`1=1`
      )
    )
    .groupBy(userReviews.id)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return reviews;
}

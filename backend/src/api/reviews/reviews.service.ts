import { db } from "../../db/database.js";
import {
  userReviews,
  likesReviews as likesReviewsTable,
  ratings,
  activity,
  Replies,
} from "../../db/schema.js";
import { and, eq } from "drizzle-orm/expressions";
import { UnauthorizedError } from "../../utils/error.class.js";
import { sql } from "drizzle-orm/sql";

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

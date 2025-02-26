import { db } from "../../db/database.js";
import {
  userReviews,
  likesReviews as likesReviewsTable,
  ratings,
} from "../../db/schema.js";
import { and, eq } from "drizzle-orm/expressions";
import { UnauthorizedError } from "../../utils/error.class.js";

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

export const likeReview = async (reviewId: number, userId: number) => {
  try {
    await db.insert(likesReviewsTable).values({ userId, reviewId });
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

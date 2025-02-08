import { db } from "../db/database.js";
import { reviews as ReviewsTable, likesReviews as likesReviewsTable, } from "../db/schema.js";
import { and, eq } from "drizzle-orm/expressions";
import { UnauthorizedError } from "../utils/error.class.js";
export const deleteReview = async (reviewId, userId) => {
    const [{ reviewUserId }] = await db
        .select({ reviewUserId: ReviewsTable.userId })
        .from(ReviewsTable)
        .where(eq(ReviewsTable.id, reviewId));
    // Check if the user is the reviewer
    if (reviewUserId !== userId) {
        throw new UnauthorizedError("Unauthorized");
    }
    await db.delete(ReviewsTable).where(eq(ReviewsTable.id, reviewId));
};
export const likeReview = async (reviewId, userId) => {
    try {
        await db.insert(likesReviewsTable).values({ userId, reviewId });
    }
    catch (error) {
        // If the like already exists for this review+user, unlike/delete it
        await db
            .delete(likesReviewsTable)
            .where(and(eq(likesReviewsTable.reviewId, reviewId), eq(likesReviewsTable.userId, userId)));
    }
};
export const checkLikes = async (mediaId, userId) => {
    const rows = await db
        .select({ reviewId: likesReviewsTable.reviewId })
        .from(likesReviewsTable)
        .innerJoin(ReviewsTable, eq(ReviewsTable.id, likesReviewsTable.reviewId))
        .where(and(eq(ReviewsTable.mediaId, mediaId), eq(likesReviewsTable.userId, userId)));
    return rows;
};

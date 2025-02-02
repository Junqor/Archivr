import { db } from "../db/database.js";
import { reviews as ReviewsTable } from "../db/schema.js";
import { eq } from "drizzle-orm/expressions";
import { UnauthorizedError } from "../utils/error.class.js";

export const deleteReview = async (reviewId: number, userId: number) => {
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
export { UnauthorizedError };

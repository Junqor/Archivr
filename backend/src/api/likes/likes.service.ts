import { db } from "../../db/database.js";
import { likes, media, mediaGenre, ratings } from "../../db/schema.js";
import { desc, asc, eq, and, inArray, lte, or } from "drizzle-orm/expressions";
import { count, avg, sql, isNull, exists } from "drizzle-orm";

const sortFields = {
  "likes.liked_at": likes.likedAt,
  "media.title": media.title,
  "media.rating": media.rating,
  "media.release_date": media.release_date,
  "media.runtime": media.runtime,
  "ratings.rating": ratings.rating,
};

export async function getUserLikes(
  user_id: number,
  limit = 4,
  offset = 0,
  sort_by: keyof typeof sortFields = "likes.liked_at",
  sort_order = "desc",
  ratingMax = 10,
  genre: string | null = null
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  let orderByClause =
    sort_order === "asc" ? asc(sortFields[sort_by]) : desc(sortFields[sort_by]);

  const avgRatingsSubquery = db
    .select({
      mediaId: ratings.mediaId,
      avg_rating: sql<number>`ROUND(AVG(${ratings.rating}))`.as("avg_rating"), // Ensuring whole number avg rating
    })
    .from(ratings)
    .groupBy(ratings.mediaId)
    .as("avgRatings");

  const likedMedia = await db
    .select({
      id: media.id,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      like_count: count(likes.id).as("like_count"),
      avg_rating: avgRatingsSubquery.avg_rating,
      user_rating: ratings.rating,
      is_liked: exists(
        db
          .select()
          .from(likes)
          .where(and(eq(likes.mediaId, media.id), eq(likes.userId, user_id)))
      ),
    })
    .from(media)
    .innerJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(avgRatingsSubquery, eq(media.id, avgRatingsSubquery.mediaId))
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
    .where(
      and(
        eq(likes.userId, user_id),
        ratingMax < 10
          ? or(lte(ratings.rating, ratingMax), isNull(ratings.rating))
          : sql`1=1`,
        genre
          ? inArray(
              media.id,
              db
                .select({ mediaId: mediaGenre.mediaId })
                .from(mediaGenre)
                .where(eq(mediaGenre.genre, genre))
            )
          : sql`1=1`
      )
    )
    .groupBy(media.id)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return likedMedia;
}

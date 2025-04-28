import { db } from "../../db/database.js";
import { likes, media, mediaGenre, ratings } from "../../db/schema.js";
import { desc, asc, eq, and, inArray, lte, or } from "drizzle-orm/expressions";
import { count, avg, sql, isNull, exists } from "drizzle-orm";

const sortFields = {
  "When Liked": likes.likedAt,
  "Media Title": media.title,
  "Media Rating": media.rating,
  "Media Release Date": media.release_date,
  "Media Runtime": media.runtime,
  Rating: ratings.rating,
};

export async function getUserLikes(
  user_id: number,
  limit = 4,
  offset = 0,
  sort_by: keyof typeof sortFields = "When Liked",
  sort_order = "desc",
  ratingMax = 10,
  genre: string | null = null
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  let orderByClause =
    sort_by in sortFields
      ? sort_order === "asc"
        ? asc(sortFields[sort_by])
        : desc(sortFields[sort_by])
      : desc(sortFields["When Liked"]);

  const avgRatingsSubquery = db
    .select({
      mediaId: ratings.mediaId,
      avg_rating: sql<number>`AVG(${ratings.rating})`.as("avg_rating"),
    })
    .from(ratings)
    .groupBy(ratings.mediaId)
    .as("avgRatings");

  // Total like count for media
  const likeCountsSub = db
    .select({
      mediaId: likes.mediaId,
      like_count: count(likes.id).as("like_count"),
    })
    .from(likes)
    .groupBy(likes.mediaId)
    .as("likeCounts");

  const likedMedia = await db
    .select({
      id: media.id,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      likes: likeCountsSub.like_count,
      userRating: avgRatingsSubquery.avg_rating,
      user_rating: ratings.rating,
      is_liked: exists(
        db
          .select()
          .from(likes)
          .where(and(eq(likes.mediaId, media.id), eq(likes.userId, user_id)))
      ),
    })
    .from(media)
    .innerJoin(
      likes,
      and(eq(likes.mediaId, media.id), eq(likes.userId, user_id))
    )
    .leftJoin(avgRatingsSubquery, eq(media.id, avgRatingsSubquery.mediaId))
    .leftJoin(likeCountsSub, eq(media.id, likeCountsSub.mediaId))
    .leftJoin(
      ratings,
      and(eq(ratings.mediaId, media.id), eq(ratings.userId, user_id))
    )
    .where(
      and(
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
    .groupBy(media.id, ratings.rating)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  return likedMedia;
}

import { avg, count, getTableColumns } from "drizzle-orm";
import { db } from "../../db/database.js";
import { likes, media, mediaGenre, ratings } from "../../db/schema.js";
import { desc, eq, and } from "drizzle-orm/expressions";

export const getMostPopularMovies = async () => {
  return await db
    .select({
      ...getTableColumns(media),
      likes: count(likes.id),
      userRating: avg(ratings.rating),
    })
    .from(media)
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
    .where(eq(media.category, "movie"))
    .orderBy(desc(media.rating))
    .groupBy(media.id)
    .limit(15);
};

export const getMostPopularShows = async () => {
  return await db
    .select({
      ...getTableColumns(media),
      likes: count(likes.id),
      userRating: avg(ratings.rating),
    })
    .from(media)
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
    .where(eq(media.category, "tv_show"))
    .orderBy(desc(media.rating))
    .groupBy(media.id)
    .limit(15);
};

export const getMostPopularAnime = async () => {
  return await db
    .select({
      ...getTableColumns(media),
      likes: count(likes.id),
      userRating: avg(ratings.rating),
    })
    .from(media)
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
    .innerJoin(
      mediaGenre,
      and(eq(media.id, mediaGenre.mediaId), eq(mediaGenre.genre, "anime"))
    )
    .groupBy(media.id)
    .orderBy(desc(media.rating))
    .limit(15);
};

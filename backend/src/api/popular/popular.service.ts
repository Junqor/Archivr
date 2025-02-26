import { getTableColumns } from "drizzle-orm";
import { db } from "../../db/database.js";
import { media, mediaGenre } from "../../db/schema.js";
import { desc, eq, and } from "drizzle-orm/expressions";

export const getMostPopularMovies = async () => {
  return await db
    .select()
    .from(media)
    .where(eq(media.category, "movie"))
    .orderBy(desc(media.rating))
    .limit(15);
};

export const getMostPopularShows = async () => {
  return await db
    .select()
    .from(media)
    .where(eq(media.category, "tv_show"))
    .orderBy(desc(media.rating))
    .limit(15);
};

export const getMostPopularAnime = async () => {
  return await db
    .select(getTableColumns(media))
    .from(media)
    .innerJoin(
      mediaGenre,
      and(eq(media.id, mediaGenre.mediaId), eq(mediaGenre.genre, "anime"))
    )
    .orderBy(desc(media.rating))
    .limit(15);
};

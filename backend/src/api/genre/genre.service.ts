import { db } from "../../db/database.js";
import { slugify } from "../../utils/slugify.js";
import { mediaGenre, media } from "../../db/schema.js";
import { desc, inArray, eq, asc } from "drizzle-orm/expressions";
import { aliasedTable, getTableColumns, sql } from "drizzle-orm";

// Get 5 most popular media of a certain genre
export async function get_popular_media_genre(genre: string) {
  //Change to drizzle
  const mediaGenre1 = aliasedTable(mediaGenre, "mediaGenre1");
  const mediaGenre2 = aliasedTable(mediaGenre, "mediaGenre2");
  const data = await db
    .select({
      ...getTableColumns(media),
      genres: sql<string>`GROUP_CONCAT(DISTINCT mediaGenre2.genre) AS genres`,
    })
    .from(media)
    .leftJoin(mediaGenre1, eq(media.id, mediaGenre1.mediaId))
    .leftJoin(mediaGenre2, eq(media.id, mediaGenre2.mediaId))
    .where(eq(mediaGenre1.genre, genre))
    .groupBy(media.id)
    .orderBy(desc(media.rating))
    .limit(5);

  return data.map((row) => {
    return {
      ...row,
      genres: row.genres?.split(","),
    };
  });
}

// Get 20 medias of a certain genre with offset
export async function get_media_genre(
  genre: string,
  offset: number,
  sortBy: "alphabetical" | "release_date" | "rating",
  order: "asc" | "desc"
) {
  let sortByClause;
  switch (sortBy) {
    case "alphabetical":
      sortByClause = media.title;
      break;
    case "release_date":
      sortByClause = media.releaseDate;
      break;
    case "rating":
      sortByClause = media.rating;
      break;
    default:
      sortByClause = media.title;
  }
  //changed to drizzle

  let rows = await db
    .select()
    .from(media)
    .where(
      inArray(
        media.id,
        db
          .select({ mediaId: mediaGenre.mediaId })
          .from(mediaGenre)
          .where(eq(mediaGenre.genre, genre))
      )
    )
    .orderBy(order === "desc" ? desc(sortByClause) : asc(sortByClause))
    .limit(30)
    .offset(offset);

  return rows;
}

// Get a list of distinct genres
export async function get_genres(): Promise<{ genre: string; slug: string }[]> {
  //Changed to drizzle

  let rows = await db
    .selectDistinct({ genre: mediaGenre.genre })
    .from(mediaGenre);

  return (rows as Array<{ genre: string }>).map((row) => ({
    genre: row.genre,
    slug: slugify(row.genre),
  }));
}

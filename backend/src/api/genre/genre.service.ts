import { db } from "../../db/database.js";
import { slugify } from "../../utils/slugify.js";
import { mediaGenre, media, likes, ratings } from "../../db/schema.js";
import { desc, inArray, eq, asc } from "drizzle-orm/expressions";
import { aliasedTable, avg, count, getTableColumns, sql } from "drizzle-orm";

// Get 5 most popular media of a certain genre
export async function get_popular_media_genre(genre: string) {
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
  sortBy: "alphabetical" | "release_date" | "popularity",
  order: "asc" | "desc"
) {
  let sortByClause;
  switch (sortBy) {
    case "alphabetical":
      sortByClause = media.title;
      break;
    case "release_date":
      sortByClause = media.release_date;
      break;
    case "popularity":
      sortByClause = media.rating;
      break;
    default:
      sortByClause = media.title;
  }

  let rows = await db
    .select({
      ...getTableColumns(media),
      likes: count(likes.id),
      userRating: avg(ratings.rating),
    })
    .from(media)
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
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
    .groupBy(media.id)
    .limit(30)
    .offset(offset);

  return rows;
}

// Get a list of distinct genres
export async function get_genres(): Promise<{ genre: string; slug: string }[]> {
  let rows = await db
    .selectDistinct({ genre: mediaGenre.genre })
    .from(mediaGenre);

  return (rows as Array<{ genre: string }>).map((row) => ({
    genre: row.genre,
    slug: slugify(row.genre),
  }));
}

export async function getGenresWithTopMedia() {
  // THANKS DEEPSEEK
  let rows = await db.execute(sql`
  WITH genre_ranking AS (
    SELECT 
        media_id,
        genre,
        ROW_NUMBER() OVER (
            PARTITION BY media_id 
            ORDER BY genre
        ) AS media_genre_rank
    FROM Media_Genre
    ),
    ranked_genres AS (
        SELECT
            gr.genre,
            m.id,
            m.rating,
            ROW_NUMBER() OVER (
                PARTITION BY gr.genre 
                ORDER BY m.rating DESC
            ) AS genre_rank,
            ROW_NUMBER() OVER (
                PARTITION BY m.id 
                ORDER BY m.rating DESC
            ) AS thumbnail_rank
        FROM genre_ranking gr
        LEFT JOIN Media m ON gr.media_id = m.id
        WHERE gr.media_genre_rank = 1  -- Only consider primary genre per media
    )
    SELECT
        genre,
        id,
        rating
    FROM ranked_genres
    WHERE genre_rank = 1  -- Get top-rated per genre
      AND thumbnail_rank = 1  -- Ensure unique thumbnails across all genres
    ORDER BY rating DESC;`);

  return (
    rows[0] as any as {
      genre: string;
      id: number;
      rating: number;
    }[]
  ).map((row) => ({
    genre: row.genre,
    id: row.id,
    slug: slugify(row.genre),
  }));
}

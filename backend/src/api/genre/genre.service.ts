import { conn } from "../../db/database.js";
import { RowDataPacket } from "mysql2";
import { TGenre, TMedia } from "../../types/index.js";
import { slugify } from "../../utils/slugify.js";

// Get 5 most popular media of a certain genre
export async function get_popular_media_genre(
  genre: string
): Promise<TMedia[]> {
  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `SELECT * FROM Media WHERE id IN (
      SELECT media_id FROM Media_Genre WHERE genre = ?)
      ORDER BY rating DESC LIMIT 5;`,
    [genre]
  );

  for (let media of rows) {
    let [genres] = await conn.query<RowDataPacket[]>(
      `SELECT genre FROM Media_Genre WHERE media_id = ?`,
      [media.id]
    );
    media.genres = (genres as Array<RowDataPacket & { genre: string }>).map(
      (row) => row.genre
    );
  }

  return rows;
}

// Get 20 medias of a certain genre with offset
export async function get_media_genre(
  genre: string,
  offset: number,
  sortBy: "alphabetical" | "release_date" | "popularity",
  order: "asc" | "desc"
): Promise<TMedia[]> {
  let orderByClause;
  switch (sortBy) {
    case "alphabetical":
      orderByClause = "title";
      break;
    case "release_date":
      orderByClause = "release_date";
      break;
    case "popularity":
      orderByClause = "rating";
      break;
    default:
      orderByClause = "title";
  }

  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `SELECT * FROM Media WHERE id IN (
            SELECT media_id FROM Media_Genre WHERE genre = ?)
            ORDER BY ${orderByClause} ${order.toUpperCase()} LIMIT 30 OFFSET ?;`,
    [genre, offset]
  );
  return rows;
}

// Get a list of distinct genres
export async function get_genres(): Promise<{ genre: string; slug: string }[]> {
  let [rows] = await conn.query<RowDataPacket[]>(
    `SELECT DISTINCT genre FROM Media_Genre;`
  );
  return (rows as Array<{ genre: string }>).map((row) => ({
    genre: row.genre,
    slug: slugify(row.genre),
  }));
}

import { conn } from "../../configs/digitalocean.config";
import { TMovie } from "../../types/user";

export type TSearchResult = {
  status: "success" | "failed";
  movies: TMovie[];
};

export async function searchMovies(query: string): Promise<TSearchResult> {
  const sql = `SELECT * FROM Media WHERE title LIKE ? LIMIT 3`;
  const [rows] = await conn.query<TMovie[]>(sql, [`%${query}%`]);

  return {
    status: "success",
    movies: rows,
  };
}

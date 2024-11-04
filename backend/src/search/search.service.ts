import { conn } from "../configs/digitalocean.config";
import { TMedia } from "../types/user";

type TSearchResult = {
  status: "success" | "failed";
  media: TMedia[];
};

// Search for media by name
export async function searchMedia(query: string): Promise<TSearchResult> {
  const sql = `SELECT * FROM Media WHERE title LIKE ? LIMIT 3`;
  const [rows] = await conn.query<TMedia[]>(sql, [`%${query}%`]);

  return {
    status: "success",
    media: rows,
  };
}

type TMediaResult = {
  status: "success" | "failed";
  media: TMedia | null;
  message?: string;
};

// Returns a single media entry by its id
export async function getMediaById(id: number): Promise<TMediaResult> {
  const sql = `SELECT * FROM Media WHERE id = ?`;
  const [rows] = await conn.query<TMedia[]>(sql, [id]);

  if (rows.length === 0) {
    return {
      status: "failed",
      media: null,
      message: "Media not found",
    };
  }

  return {
    status: "success",
    media: rows[0],
  };
}

import { ResultSetHeader } from "mysql2/promise";
import { conn } from "../configs/digitalocean.config.js";
import { TMedia } from "../types/user.js";

export async function insert_media(media: Partial<TMedia>) {
  try {
    await conn.query<ResultSetHeader>(
      `INSERT INTO Media (category, title, description, release_date, age_rating, thumbnail_url, rating, genre) VALUES (?,?,?,?,?,?,?,?);`,
      [
        media.category,
        media.title,
        media.description,
        media.release_date,
        media.age_rating,
        media.thumbnail_url,
        media.rating,
        media.genre,
      ]
    );
  } catch (error) {
    console.error(error);
    throw Error("One of your possibly many values was wrong in a way");
  }
}

// dont make it use the id property of media that would be stupid
export async function update_media(media_id: number, media: Partial<TMedia>) {
  try {
    console.log(media);
    await conn.query<ResultSetHeader>(
      `UPDATE Media SET category=?, title=?, description=?, release_date=?, age_rating=?, thumbnail_url=?, rating=?, genre=? WHERE id=?;`,
      [
        media.category,
        media.title,
        media.description,
        media.release_date,
        media.age_rating,
        media.thumbnail_url,
        media.rating,
        media.genre,
        media_id,
      ]
    );
  } catch (error) {
    console.error(error);
    throw Error("One of your possibly many values was wrong in a way");
  }
}

export async function delete_media(media_id: number) {
  try {
    await conn.query<ResultSetHeader>(`DELETE FROM Media WHERE id=?`, [
      media_id,
    ]);
  } catch (error) {
    console.error(error);
    throw Error("There was a problem.");
  }
}

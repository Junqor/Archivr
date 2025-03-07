import { RowDataPacket } from "mysql2";
import { conn } from "../../db/database.js";
import { TMedia } from "../../types/index.js";
import { db } from "../../db/database.js";
import { desc, eq, sql } from "drizzle-orm";
import { media, mediaGenre, users } from "../../db/schema.js";
type TSearchResult = {
  status: "success" | "failed";
  media: TMedia[];
};

// Search for media by name
export async function searchMedia(
  query: string,
  limit: number,
  offset: number
) {
  const rows = await db
    .select()
    .from(media)
    .where(sql`${media.title} LIKE ${"%" + query + "%"}`)
    .orderBy(desc(media.rating))
    .limit(limit)
    .offset((offset - 1) * limit);

  // Get genres for the media

  const Media = await Promise.all(
    rows.map(async (row) => {
      const genres = await getGenres(row.id);
      return { ...row, genres: genres };
    })
  );

  return {
    status: "success",
    media: Media,
  };
}

// Search for users by name
export async function searchUsers(
  query: string,
  limit: number,
  offset: number
) {
  const rows = await db
    .selectDistinct({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatar_url: users.avatarUrl,
      role: users.role
    })
    .from(users)
    .where(sql`${users.username} LIKE ${"%" + query + "%"} OR ${users.displayName} LIKE ${"%" + query + "%"} OR ${users.id} = ${query}`)
    .limit(limit)
    .offset((offset - 1) * limit);

  return {
    status: "success",
    users: rows,
  };
}

// Returns a single media entry by its id
export async function getMediaById(id: number) {
  const rows = await db
    .select()
    .from(media)
    .where(sql`${media.id} = ${id}`);

  if (rows.length === 0) {
    return {
      status: "failed",
      media: null,
      message: "Media not found",
    };
  }

  const genres = await getGenres(id);

  const mediaAns = { ...rows[0], genres: genres };

  return {
    status: "success",
    media: mediaAns,
  };
}

// Helper function for getting a media's genres
async function getGenres(mediaId: number) {
  const genreRows = await db
    .select()
    .from(mediaGenre)
    .where(eq(mediaGenre.mediaId, mediaId));

  const genres = genreRows.map((row) => row.genre as string);
  return genres;
}

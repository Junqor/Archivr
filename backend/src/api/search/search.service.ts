import { db } from "../../db/database.js";
import {
  aliasedTable,
  count,
  desc,
  eq,
  sql,
  or,
  asc,
  getTableColumns,
  avg,
} from "drizzle-orm";
import {
  follows,
  likes,
  media,
  mediaGenre,
  ratings,
  remoteId,
  userReviews,
  users,
  userSettings,
} from "../../db/schema.js";
import { getMediaBackground } from "../media/media.service.js";

// Search for media by name
export async function searchMediaFilter(
  query: string,
  limit: number,
  offset: number,
  sortBy: "alphabetical" | "release_date" | "popularity",
  order: "asc" | "desc"
) {
  const rows = await db
    .select({
      ...getTableColumns(media),
      userRating: avg(ratings.rating),
      likes: count(likes.id),
    })
    .from(media)
    .leftJoin(ratings, eq(ratings.mediaId, media.id))
    .leftJoin(likes, eq(likes.mediaId, media.id))
    .where(sql`${media.title} LIKE ${"%" + query + "%"}`)
    .orderBy(
      order === "asc"
        ? asc(
            sortBy === "alphabetical"
              ? media.title
              : sortBy === "release_date"
              ? media.release_date
              : media.rating
          )
        : desc(
            sortBy === "alphabetical"
              ? media.title
              : sortBy === "release_date"
              ? media.release_date
              : media.rating
          )
    )
    .groupBy(media.id)
    .limit(limit)
    .offset(offset);

  return {
    status: "success",
    media: rows,
  };
}

// Search for users by name
export async function searchUsersModPortal(
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
      role: users.role,
    })
    .from(users)
    .where(
      sql`${users.username} LIKE ${"%" + query + "%"} OR ${
        users.displayName
      } LIKE ${"%" + query + "%"} OR ${users.id} = ${query}`
    )
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
    .select({
      ...getTableColumns(media),
      tmdbId: remoteId.tmdbId,
      tvdbId: remoteId.tvdbId,
    })
    .from(media)
    .leftJoin(remoteId, eq(media.id, remoteId.id))
    .where(sql`${media.id} = ${id}`);

  if (rows.length === 0) {
    return {
      status: "failed",
      media: null,
      message: "Media not found",
    };
  }

  const genres = await getGenres(id);

  const result = { ...rows[0], genres: genres };

  try {
    const background = await getMediaBackground(id); // Get a background image

    return { ...result, background: background };
  } catch (e) {
    return result;
  }
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

export async function searchUsers(
  query: string,
  limit: number,
  offset: number,
  sortBy: "username" | "followers",
  orderBy: "asc" | "desc"
) {
  const followsAlias = aliasedTable(follows, "following");
  const rows = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      username: users.username,
      avatarUrl: users.avatarUrl,
      followers: count(sql`DISTINCT ${follows.id}`),
      following: count(sql`DISTINCT ${followsAlias.id}`),
      pronouns: userSettings.pronouns,
      reviews: count(sql`DISTINCT ${userReviews.id}`),
      likes: count(sql`DISTINCT ${likes.id}`),
    })
    .from(users)
    .leftJoin(follows, eq(users.id, follows.followeeId)) // Get following count
    .leftJoin(followsAlias, eq(users.id, followsAlias.followerId)) // Get followers count
    .leftJoin(userSettings, eq(users.id, userSettings.user_id))
    .leftJoin(userReviews, eq(users.id, userReviews.userId))
    .leftJoin(likes, eq(users.id, likes.userId))
    .where(
      or(
        sql`${users.username} LIKE ${"%" + query + "%"}`,
        sql`${users.displayName} LIKE ${"%" + query + "%"}`
      )
    )
    .orderBy(
      orderBy === "desc"
        ? desc(
            sortBy === "username"
              ? users.username
              : count(sql`DISTINCT ${follows.id}`)
          )
        : asc(
            sortBy === "username"
              ? users.username
              : count(sql`DISTINCT ${follows.id}`)
          ),
      orderBy === "desc" ? desc(users.username) : asc(users.username) // incase they don't have a display name
    )
    .groupBy(users.id, userSettings.pronouns)
    .limit(limit)
    .offset(offset * limit);

  return {
    status: "success",
    data: rows,
  };
}

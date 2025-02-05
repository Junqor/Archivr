import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { media, remoteId } from "../db/schema.js";

export const getWatchProviders = async (id: number) => {
  const [{ tmdbId, type }] = await db
    .select({ tmdbId: remoteId.tmdbId, type: media.category })
    .from(remoteId)
    .leftJoin(media, eq(media.id, remoteId.id))
    .where(eq(remoteId.id, id));
  if (!tmdbId) {
    throw new Error("Failed to fetch watch providers");
  }
  const url = `https://api.themoviedb.org/3/${
    type === "movie" ? "movie" : "tv"
  }/${tmdbId}/watch/providers`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  const data = await response.json();

  return data.results;
};

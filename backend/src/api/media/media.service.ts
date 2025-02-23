import { conn, db } from "../../db/database.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TMedia, TReview } from "../../types/index.js";
import {
  users as UsersTable,
  likesReviews as likesReviewsTable,
  likes,
  media,
  mediaGenre,
  ratings,
  userReviews,
  users,
  remoteId,
} from "../../db/schema.js";
import {
  desc,
  eq,
  and,
  inArray,
  not,
  gte,
  asc,
  or,
} from "drizzle-orm/expressions";
import { count, InferSelectModel, sql, sum } from "drizzle-orm";
import { logger } from "../../configs/logger.js";
import { serverConfig } from "../../configs/secrets.js";
import { union } from "drizzle-orm/mysql-core";

export async function update_rating(
  media_id: number,
  user_id: number,
  new_rating: number
) {
  let [rows] = await conn.query<(RowDataPacket & number)[]>(
    "INSERT INTO Ratings (media_id, user_id, rating) VALUES (?, ?, ?) " +
      "ON DUPLICATE KEY UPDATE rating = ?",
    [media_id, user_id, new_rating, new_rating]
  );
  return;
}

export async function get_media_rating(media_id: number): Promise<number> {
  let [rows] = await conn.query<(RowDataPacket & number)[]>(
    "SELECT AVG(rating) as avg FROM Ratings WHERE media_id=?;",
    [media_id]
  );
  if (rows[0].length == 0) {
    throw Error("RATINGS AREN'T REAL");
  }
  return rows[0].avg;
}

export async function get_user_rating(
  media_id: number,
  user_id: number
): Promise<number> {
  let [rows] = await conn.query<(RowDataPacket & number)[]>(
    "SELECT rating as rat FROM Ratings WHERE media_id=? AND user_id=?;",
    [media_id, user_id]
  );
  if (rows[0].length == 0) {
    throw Error("RATINGS AREN'T REAL");
  }
  return rows[0][0].rat;
}

export async function update_review(
  media_id: number,
  user_id: number,
  new_comment: string,
  new_rating: number
) {
  const [ratingId] = await db
    .insert(ratings)
    .values({ mediaId: media_id, userId: user_id, rating: new_rating })
    .onDuplicateKeyUpdate({
      set: { rating: new_rating, ratedAt: sql`CURRENT_TIMESTAMP` },
    })
    .$returningId();

  if (new_comment.length > 0) {
    await db
      .insert(userReviews)
      .values({
        mediaId: media_id,
        userId: user_id,
        comment: new_comment,
        ratingId: ratingId.id,
      })
      .onDuplicateKeyUpdate({
        set: {
          comment: new_comment,
          ratingId: ratingId.id,
          createdAt: sql`CURRENT_TIMESTAMP`,
        },
      });
  }
  return;
}

export async function get_media_reviews(
  media_id: number,
  amount: number,
  offset: number
) {
  let rows = await db
    .select({
      id: userReviews.id,
      user_id: UsersTable.id,
      media_id: userReviews.mediaId,
      username: UsersTable.username,
      comment: userReviews.comment,
      created_at: userReviews.createdAt,
      rating: ratings.rating,
      likes: count(likesReviewsTable.id).as("likes_count"),
    })
    .from(userReviews)
    .innerJoin(UsersTable, eq(userReviews.userId, UsersTable.id))
    .leftJoin(likesReviewsTable, eq(userReviews.id, likesReviewsTable.reviewId))
    .innerJoin(ratings, eq(ratings.id, userReviews.ratingId))
    .where(eq(userReviews.mediaId, media_id))
    .groupBy(userReviews.id)
    .orderBy(desc(userReviews.createdAt))
    .limit(amount)
    .offset(offset);

  return rows satisfies TReview[];
}

export async function get_user_review(
  media_id: number,
  user_id: number
): Promise<TReview> {
  let [rows] = await conn.query<(RowDataPacket & TReview)[]>(
    "SELECT * FROM UserReviews WHERE media_id=? AND user_id=?;",
    [media_id, user_id]
  );
  if (rows[0].length == 0) {
    throw Error("REVIEWS AREN'T REAL");
  }
  return rows[0];
}

// Try inserting the like; if it already exists, delete it instead.
export async function update_likes(media_id: number, user_id: number) {
  const [result] = await conn.query<ResultSetHeader>(
    `INSERT IGNORE INTO Likes (media_id, user_id) VALUES (?, ?)`,
    [media_id, user_id]
  );

  // Check if a row was inserted; if not, delete it instead.
  if (result.affectedRows === 0) {
    // If the row wasn’t inserted (it already exists), delete it to "toggle" the like.
    await conn.query("DELETE FROM Likes WHERE media_id = ? AND user_id = ?;", [
      media_id,
      user_id,
    ]);
  }
}

export async function is_liked(
  media_id: number,
  user_id: number
): Promise<boolean> {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT 1 FROM Likes WHERE media_id = ? AND user_id = ? LIMIT 1;",
    [media_id, user_id]
  );
  return rows.length > 0;
}

export async function get_likes(media_id: number): Promise<number> {
  let [rows] = await conn.query<RowDataPacket[]>(
    "SELECT COUNT(*) as num FROM Likes WHERE media_id=?;",
    [media_id]
  );
  return rows[0].num ?? 0;
}

export async function getMostPopular() {
  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `SELECT * FROM Media ORDER BY rating DESC LIMIT 15;`
  );

  return {
    status: "success",
    media: rows,
  };
}

export async function get_recently_reviewed() {
  let rows = await db
    .selectDistinct({
      id: media.id,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      userId: users.id,
      userName: users.username,
      review: userReviews.comment,
      reviewRating: ratings.rating,
      created_at: userReviews.createdAt,
    })
    .from(media)
    .innerJoin(userReviews, eq(media.id, userReviews.mediaId))
    .innerJoin(users, eq(users.id, userReviews.userId))
    .innerJoin(ratings, eq(ratings.id, userReviews.ratingId))
    .where(
      // Ensure only the most recent reviews for each media is selected. Still have to write raw sql for this one 🤕
      sql`UserReviews.created_at = (
        SELECT MAX(r.created_at)
        FROM UserReviews r
        WHERE r.media_id = UserReviews.media_id
      )`
    )
    .orderBy(desc(userReviews.createdAt))
    .limit(8);

  return {
    status: "success",
    media: rows,
  };
}

export async function getTopRatedPicks() {
  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `WITH WeightedMovies AS (
      SELECT 
        Media.id,
        Media.category,
        Media.title,
        Media.description,
        Media.release_date,
        Media.age_rating,
        Media.thumbnail_url,
        Media.rating AS base_rating,
        AVG(Ratings.rating) AS average_rating,
        COUNT(Ratings.rating) AS num_ratings,
        (
          -- Weighted average rating based on number of ratings
          (COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * AVG(Ratings.rating) +
          (50 / (COUNT(Ratings.rating) + 50)) * (
            SELECT AVG(rating) FROM Ratings
          )
        ) AS weighted_rating,
        -- Calculate the age of the movie in years
        TIMESTAMPDIFF(YEAR, Media.release_date, CURDATE()) AS age,
        -- Apply a time-decay weight (linear decay, modify factor if needed)
        (
          (COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * AVG(Ratings.rating) +
          (50 / (COUNT(Ratings.rating) + 50)) * (
            SELECT AVG(rating) FROM Ratings
          )
        ) * (1 - LEAST(TIMESTAMPDIFF(YEAR, Media.release_date, CURDATE()) / 50, 1)) AS final_weighted_score
      FROM Media
      LEFT JOIN Ratings ON Media.id = Ratings.media_id
      GROUP BY Media.id
    )
    SELECT 
      id,
      category,
      title,
      description,
      release_date,
      age_rating,
      thumbnail_url,
      base_rating as rating,
      average_rating,
      num_ratings,
      weighted_rating,
      final_weighted_score
    FROM WeightedMovies
    ORDER BY final_weighted_score DESC
    LIMIT 15;`
  );

  return {
    status: "success",
    media: rows,
  };
}

export const getTrending = async (type: "movie" | "tv") => {
  const response = await Promise.all(
    // Get 3 pages (20x3 = 60 results) in case not enough match the ones in our db
    [...Array(3)].map((_, i) =>
      fetch(
        `https://api.themoviedb.org/3/trending/${type}/week?language=en-US&page=${
          i + 1
        }`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${serverConfig.TMDB_API_KEY}`,
          },
        }
      )
    )
  );
  if (response.some((r) => !r.ok)) {
    throw new Error("Failed to fetch trending data");
  }

  //https://developer.themoviedb.org/reference/trending-movies
  const trendingIds = (
    await Promise.all(response.map((r) => r.json()))
  ).flatMap((re) => re.results.map((media: any) => media.id)); // brujeria

  // Get 15 media from our db that match the tmdb ids
  const trending = await db
    .select({
      id: media.id,
      category: media.category,
      title: media.title,
      description: media.description,
      release_date: media.release_date,
      age_rating: media.age_rating,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      runtime: media.runtime,
    })
    .from(media)
    .leftJoin(remoteId, eq(media.id, remoteId.id))
    .where(inArray(remoteId.tmdbId, trendingIds))
    .orderBy(
      asc(sql`FIELD(${remoteId.tmdbId}, ${sql.join(trendingIds, sql`,`)})`)
    ); // https://www.w3schools.com/sql/func_mysql_field.asp

  return trending;
};

export const getTrendingPaginated = async (
  type: "movie" | "tv",
  page: number
) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/${type}/week?language=en-US&page=${
      page + 1
    }`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${serverConfig.TMDB_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending data");
  }

  const trendingIds = (await response.json()).results.map((r: any) => r.id);

  const trending = await db
    .select({
      id: media.id,
      category: media.category,
      title: media.title,
      description: media.description,
      release_date: media.release_date,
      age_rating: media.age_rating,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      runtime: media.runtime,
    })
    .from(media)
    .leftJoin(remoteId, eq(media.id, remoteId.id))
    .where(inArray(remoteId.tmdbId, trendingIds))
    .orderBy(
      asc(sql`FIELD(${remoteId.tmdbId}, ${sql.join(trendingIds, sql`,`)})`)
    );

  return trending;
};
export async function get_new_for_you(user_id: number) {
  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `SELECT DISTINCT Media.*
    FROM Media
    WHERE Media.id NOT IN (
      SELECT media_id FROM Ratings WHERE user_id = ?
      UNION
      SELECT media_id FROM Likes WHERE user_id = ?
      UNION
      SELECT media_id FROM UserReviews WHERE user_id = ?
    )
    AND Media.release_date <= CURDATE()
    ORDER BY RAND()
    LIMIT 15;`,
    [user_id, user_id, user_id]
  );

  return {
    status: "success",
    media: rows,
  };
}

// Get the users total number of likes, reviews, and ratings
export async function get_user_stats(user_id: number) {
  let [rows] = await conn.query<RowDataPacket[]>(
    `SELECT 
    (SELECT COUNT(*) FROM Likes WHERE user_id = ?) AS likes,
    (SELECT COUNT(*) FROM UserReviews WHERE user_id = ?) AS reviews,
    (SELECT COUNT(*) FROM Ratings WHERE user_id = ?) AS ratings;`,
    [user_id, user_id, user_id]
  );
  return rows[0];
}

export const getMediaBackground = async (id: number) => {
  const [{ tvdbId, type }] = await db
    .select({ tvdbId: remoteId.tvdbId, type: media.category })
    .from(remoteId)
    .leftJoin(media, eq(media.id, remoteId.id))
    .where(eq(remoteId.id, id));
  if (!tvdbId) {
    throw new Error("Failed to fetch media background");
  }
  const url = `https://api4.thetvdb.com/v4/${
    type === "movie" ? "movies" : "series"
  }/${tvdbId}/extended`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TVDB_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch media background");
  }

  const data = await response.json();
  interface Artwork {
    type: number;
    image: string;
  }

  interface TvdbResponse {
    data: {
      artworks: Artwork[];
    };
  }

  interface Artwork {
    type: number;
    image: string;
  }

  interface TvdbResponse {
    data: {
      artworks: Artwork[];
    };
  }

  const background: Artwork | undefined = (
    data as TvdbResponse
  ).data.artworks.find(
    (artwork: Artwork) => artwork.image && artwork.image.includes("backgrounds")
  );
  // If no background is found, select the first image with fanart in the url
  if (!background) {
    return (data as TvdbResponse).data.artworks.find(
      (artwork: Artwork) => artwork.image && artwork.image.includes("fanart")
    )?.image;
  }
  return background ? background.image : null;
};

// Get the first trailer link from thetvdb API for a media
export const getMediaTrailer = async (id: number) => {
  const [{ tvdbId, type }] = await db
    .select({ tvdbId: remoteId.tvdbId, type: media.category })
    .from(remoteId)
    .leftJoin(media, eq(media.id, remoteId.id))
    .where(eq(remoteId.id, id));
  if (!tvdbId) {
    throw new Error("Failed to fetch media trailer");
  }
  const url = `https://api4.thetvdb.com/v4/${
    type === "movie" ? "movies" : "series"
  }/${tvdbId}/extended`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TVDB_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch media trailer");
  }

  const data = await response.json();
  interface Trailer {
    type: number;
    url: string;
  }

  interface TvdbResponse {
    data: {
      trailers: Trailer[];
    };
  }

  const trailer: Trailer | undefined = (
    data as TvdbResponse
  ).data.trailers.find((trailer: Trailer) => trailer.url);
  return trailer ? trailer.url : null;
};

// We think you'd love these
export async function get_recommended_for_you(user_id: number) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user_id provided");
  }

  // The minimum rating a media needs to be considered for recommendations
  const RATING_THRESHOLD = 5;

  // Step 1: Get media that the user has rated or liked
  const ratingsIds = db
    .select({ mediaId: ratings.mediaId })
    .from(ratings)
    .where(
      and(eq(ratings.userId, user_id), gte(ratings.rating, RATING_THRESHOLD))
    );
  const likesIds = db
    .select({ mediaId: likes.mediaId })
    .from(likes)
    .where(eq(likes.userId, user_id));
  const userInteractions = await union(likesIds, ratingsIds);

  const interactedMediaIds = userInteractions.map(
    (interaction) => interaction.mediaId
  );

  // Step 2: Find users that have liked or highly rated the same media
  const similarUsers = await union(
    db // Get users that have rated the same media
      .selectDistinct({ userId: ratings.userId })
      .from(ratings)
      .where(
        and(
          inArray(ratings.mediaId, interactedMediaIds),
          gte(ratings.rating, RATING_THRESHOLD)
        )
      ),
    db // Get users that have liked the same media
      .select({ userId: likes.userId })
      .from(likes)
      .where(inArray(likes.mediaId, interactedMediaIds))
  );

  const similarUserIds = similarUsers
    .map((user) => user.userId)
    .filter((id) => id !== user_id);

  // Step 3: Get the genres that the user has interacted with the most and normalize them
  const genres = await db
    .select({ genre: mediaGenre.genre, interactions: count(mediaGenre.genre) })
    .from(mediaGenre)
    .leftJoin(media, eq(media.id, mediaGenre.mediaId))
    .where(inArray(media.id, interactedMediaIds))
    .groupBy(mediaGenre.genre);

  const min = genres.reduce(
    (acc, curr) => Math.min(acc, curr.interactions),
    Infinity
  );
  const max = genres.reduce((acc, curr) => Math.max(acc, curr.interactions), 0);

  const normalizedGenres: Record<string, number> = {};
  genres.forEach((g) => {
    normalizedGenres[g.genre] = (g.interactions - min) / (max - min);
  });

  // Step 4: Calculate a genre factor for each media based on the genres it shares with the normalized genres
  // Essentially a sum of the normalized genre values that are present in the media's genres
  const genreFactor = sql`
      SUM(
        CASE 
          ${sql.join(
            Object.values(genres).map(
              ({ genre }) =>
                sql`WHEN ${mediaGenre.genre} = ${genre} THEN ${normalizedGenres[genre]}`
            ),
            sql` `
          )}
          ELSE 0
        END
      )
    `;

  // Step 5: Get the count of similar user interactions for each media
  const similarUserInteractions = sql`(
    (
      SELECT COUNT(*) FROM ${ratings}
      WHERE ${eq(ratings.mediaId, media.id)}
        AND ${inArray(ratings.userId, similarUserIds)}
        AND ${gte(ratings.rating, RATING_THRESHOLD)}
    )
    +
    (
      SELECT COUNT(*) FROM ${likes}
      WHERE ${eq(likes.mediaId, media.id)}
        AND ${inArray(likes.userId, similarUserIds)}
    )
    )`;

  const weightFactor = 10_000_000; // Maybe tweak this if user interactions start being too much when we get more users
  const finalWeight = sql`( ${similarUserInteractions} * ${genreFactor} * ${weightFactor} ) + ( ${genreFactor} * ${media.rating} )`;

  const recommendedMedia = await db
    .selectDistinct({
      id: media.id,
      category: media.category,
      title: media.title,
      release_date: media.release_date,
      age_rating: media.age_rating,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      runtime: media.runtime,
      weight: finalWeight,
    })
    .from(media)
    .leftJoin(mediaGenre, eq(media.id, mediaGenre.mediaId))
    .where(not(inArray(media.id, interactedMediaIds))) // filter out already interacted media
    .groupBy(media.id)
    .orderBy(desc(finalWeight))
    .limit(24);

  return recommendedMedia;
}

// Because you watched...
export async function get_similar_to_watched(user_id: number) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user_id provided");
  }

  // Step 1: Get the highly rated or liked media by the user
  const userInteractions = await union(
    db
      .select({ mediaId: ratings.mediaId, title: media.title })
      .from(ratings)
      .innerJoin(media, eq(ratings.mediaId, media.id))
      .where(and(eq(ratings.userId, user_id), gte(ratings.rating, 5))),
    db
      .select({ mediaId: likes.mediaId, title: media.title })
      .from(likes)
      .innerJoin(media, eq(likes.mediaId, media.id))
      .where(eq(likes.userId, user_id))
  );

  const interactedMediaIds = userInteractions.map(
    (interaction) => interaction.mediaId
  );

  if (interactedMediaIds.length === 0) {
    return {
      status: "success",
      media: [],
      basedOn: null,
    };
  }

  const recentMediaTitle = userInteractions[0].title;

  // Step 2: Get the genres of the most recently watched media
  const genres = await db
    .select({ genre: mediaGenre.genre })
    .from(mediaGenre)
    .where(eq(mediaGenre.mediaId, interactedMediaIds[0]));

  const genreList = genres.map((g) => g.genre);

  // Step 3: Get media that match all the genres
  const similarMedia = await db
    .selectDistinct({
      id: media.id,
      category: media.category,
      title: media.title,
      release_date: media.release_date,
      age_rating: media.age_rating,
      thumbnail_url: media.thumbnail_url,
      rating: media.rating,
      runtime: media.runtime,
    })
    .from(media)
    .innerJoin(mediaGenre, eq(media.id, mediaGenre.mediaId))
    .where(
      and(
        inArray(mediaGenre.genre, genreList),
        not(inArray(media.id, interactedMediaIds)) // Exclude media user has already watched
      )
    )
    .groupBy(media.id)
    .having(sql`COUNT(DISTINCT ${mediaGenre.genre}) = ${genreList.length}`)
    .orderBy(desc(media.rating)) // Weighted random selection
    .limit(16);

  // Optional: If there are less than 16 similar media, get the remaining 16 from the fallback genres that match any 1 of the genres
  if (similarMedia.length < 16) {
    const fallbackMedia = await db
      .selectDistinct({
        id: media.id,
        category: media.category,
        title: media.title,
        release_date: media.release_date,
        age_rating: media.age_rating,
        thumbnail_url: media.thumbnail_url,
        rating: media.rating,
        runtime: media.runtime,
      })
      .from(media)
      .innerJoin(mediaGenre, eq(media.id, mediaGenre.mediaId))
      .where(inArray(mediaGenre.genre, genreList))
      .groupBy(media.id)
      .orderBy(sql`COUNT(DISTINCT ${mediaGenre.genre}) DESC`) // Order by the number of genres the media matches
      .limit(16 - similarMedia.length);

    return {
      media: [...similarMedia, ...fallbackMedia],
      basedOn: recentMediaTitle,
    };
  }

  return {
    media: similarMedia,
    basedOn: recentMediaTitle,
  };
}

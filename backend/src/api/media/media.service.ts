import { db } from "../../db/database.js";
import { TReview } from "../../types/index.js";
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
  userSettings,
  activity,
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
import { count, sql, avg } from "drizzle-orm";
import { serverConfig } from "../../configs/secrets.js";
import { union } from "drizzle-orm/mysql-core";

export async function update_rating(
  media_id: number,
  user_id: number,
  new_rating: number
) {
  await db
    .insert(ratings)
    .values({
      mediaId: media_id,
      userId: user_id,
      rating: new_rating,
    })
    .onDuplicateKeyUpdate({ set: { rating: new_rating } });
}

export async function get_media_rating(
  media_id: number
): Promise<number | null> {
  const [row] = await db
    .select({ avg: avg(ratings.rating) })
    .from(ratings)
    .where(eq(ratings.mediaId, media_id));

  return row.avg === null ? null : parseInt(row.avg);
}

// I disabled sql_mode=only_full_group_by to make this slop work with display_name
export async function get_media_reviews(
  media_id: number,
  amount: number,
  offset: number
) {
  let rows = await db
    .select({
      user: {
        username: UsersTable.username,
        avatar_url: UsersTable.avatarUrl,
        role: UsersTable.role,
        display_name: UsersTable.displayName,
      },
      review: {
        id: userReviews.id,
        user_id: UsersTable.id,
        media_id: userReviews.mediaId,
        username: UsersTable.username,
        display_name: UsersTable.displayName,
        comment: userReviews.comment,
        created_at: userReviews.createdAt,
        rating: ratings.rating,
        likes: count(likesReviewsTable.id).as("likes_count"),
      },
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

  return rows;
}

// ! deprecated
export async function get_user_review(
  media_id: number,
  user_id: number
): Promise<TReview> {
  let [rows] = await db
    .select({
      id: userReviews.id,
      user_id: userReviews.userId,
      media_id: userReviews.mediaId,
      comment: userReviews.comment,
      created_at: userReviews.createdAt,
      rating: ratings.rating,
    })
    .from(userReviews)
    .where(
      and(eq(userReviews.mediaId, media_id), eq(userReviews.userId, user_id))
    );

  if (rows === null) {
    throw Error("REVIEWS AREN'T REAL");
  }
  return rows;
}

// Try inserting the like; if it already exists, delete it instead.
export async function update_likes(media_id: number, user_id: number) {
  await db.transaction(async (tx) => {
    const [result] = await tx
      .insert(likes)
      .ignore()
      .values({ mediaId: media_id, userId: user_id });

    // Check if a row was inserted; if not, delete it instead.
    if (result.affectedRows === 0) {
      // If the row wasn’t inserted (it already exists), delete it to "toggle" the like.
      await tx
        .delete(likes)
        .where(
          sql`${likes.mediaId} = ${media_id} and ${likes.userId} = ${user_id}`
        );
    } else {
      // Update activity
      await tx.insert(activity).values({
        userId: user_id,
        activityType: "like_media",
        targetId: media_id,
      });
    }
  });
}

export async function is_liked(
  media_id: number,
  user_id: number
): Promise<boolean> {
  const rows = await db
    .select()
    .from(likes)
    .where(and(eq(likes.mediaId, media_id), eq(likes.userId, user_id)))
    .limit(1);

  return rows.length > 0;
}

export async function get_likes(media_id: number): Promise<number> {
  let [row] = await db
    .select({ num: count() })
    .from(likes)
    .where(eq(likes.mediaId, media_id));

  return row.num ?? 0;
}

export async function getMostPopular() {
  const rows = await db
    .select()
    .from(media)
    .orderBy(desc(media.rating))
    .limit(15);

  return rows;
}

export async function get_recently_reviewed() {
  let rows = await db
    .selectDistinct({
      media: {
        id: media.id,
        title: media.title,
        thumbnail_url: media.thumbnail_url,
        rating: media.rating,
      },
      user: {
        userId: users.id,
        username: users.username,
        avatar_url: users.avatarUrl,
        display_name: users.displayName,
        role: users.role,
      },
      review: {
        reviewText: userReviews.comment,
        reviewRating: ratings.rating,
        created_at: userReviews.createdAt,
      },
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

  return rows;
}

export async function getTopRatedPicks() {
  const WeightedMovies = db.$with("WeightedMovies").as(
    db
      .select({
        mediaId: media.id,
        mediaCategory: media.category,
        mediaTitle: media.title,
        mediaDescription: media.description,
        mediaRelease_Date: media.release_date,
        mediaAge_Rating: media.age_rating,
        mediaThumbnailURL: media.thumbnail_url,
        base_rating: media.rating,
        average_rating: avg(ratings.rating).as("average_rating"),
        num_ratings: count(ratings.rating).as("num_ratings"),
        weighted_rating:
          sql<number>`(COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * AVG(Ratings.rating) +
        (50 / (COUNT(Ratings.rating) + 50)) * (
          SELECT AVG(rating) FROM Ratings
        )`.as("weighted_rating"),
        age: sql<number>`TIMESTAMPDIFF(YEAR, Media.release_date, CURDATE())`.as(
          "age"
        ),
        final_weighted_score: sql<number>`(
          (COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * AVG(Ratings.rating) +
          (50 / (COUNT(Ratings.rating) + 50)) * (
            SELECT AVG(rating) FROM Ratings
          )
        ) * (1 - LEAST(TIMESTAMPDIFF(YEAR, Media.release_date, CURDATE()) / 50, 1))`.as(
          "final_weighted_score"
        ),
      })
      .from(media)
      .leftJoin(ratings, eq(media.id, ratings.mediaId))
      .groupBy(media.id)
  );

  const rows = await db
    .with(WeightedMovies)
    .select({
      id: WeightedMovies.mediaId,
      category: WeightedMovies.mediaCategory,
      title: WeightedMovies.mediaTitle,
      description: WeightedMovies.mediaDescription,
      release_date: WeightedMovies.mediaRelease_Date,
      age_rating: WeightedMovies.mediaAge_Rating,
      thumbnail_url: WeightedMovies.mediaThumbnailURL,
      base_rating: WeightedMovies.base_rating,
      average_rating: WeightedMovies.average_rating,
      num_rating: WeightedMovies.num_ratings,
      weighted_rating: WeightedMovies.weighted_rating,
      final_weighted_score: WeightedMovies.final_weighted_score,
    })
    .from(WeightedMovies)
    .orderBy(desc(WeightedMovies.final_weighted_score))
    .limit(15);

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
  const data = await db
    .selectDistinct()
    .from(media)
    .where(
      and(
        not(
          inArray(
            media.id,
            db
              .select({ mediaId: likes.mediaId })
              .from(likes)
              .where(eq(likes.userId, user_id))
              .union(
                db
                  .select({ mediaId: ratings.mediaId })
                  .from(ratings)
                  .where(eq(ratings.userId, user_id))
              )
              .union(
                db
                  .select({ mediaId: userReviews.mediaId })
                  .from(userReviews)
                  .where(eq(userReviews.userId, user_id))
              )
          )
        ),
        sql`${media.release_date} <= CURDATE()`
      )
    )
    .orderBy(sql`RAND()`)
    .limit(15);

  return data;
}

// Get the users total number of likes, reviews, and ratings
export async function get_user_stats(user_id: number) {
  const like = await db.$count(likes, eq(likes.userId, user_id));
  const review = await db.$count(userReviews, eq(userReviews.userId, user_id));
  const rating = await db.$count(ratings, eq(ratings.userId, user_id));

  return {
    likes: like,
    reviews: review,
    ratings: rating,
  };
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
    const range = max - min;
    normalizedGenres[g.genre] =
      range === 0 ? 0.5 : (g.interactions - min) / range;
  });

  // Step 4: Calculate a genre factor for each media based on the genres it shares with the normalized genres
  // Essentially a sum of the normalized genre values that are present in the media's genres
  const genreFactor =
    genres.length > 0
      ? sql`
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
    `
      : sql`1`;

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
  const userInteractions = db.$with("userInteractions").as(
    union(
      db
        .select({
          mediaId: ratings.mediaId,
          title: media.title,
          createdAt: ratings.ratedAt,
        })
        .from(ratings)
        .innerJoin(media, eq(ratings.mediaId, media.id))
        .where(and(eq(ratings.userId, user_id), gte(ratings.rating, 5))),
      db
        .select({
          mediaId: likes.mediaId,
          title: media.title,
          createdAt: likes.likedAt,
        })
        .from(likes)
        .innerJoin(media, eq(likes.mediaId, media.id))
        .where(eq(likes.userId, user_id))
    )
  );

  const recentInteractions = await db
    .with(userInteractions)
    .select({
      mediaId: userInteractions.mediaId,
      title: userInteractions.title,
      createdAt: userInteractions.createdAt,
    })
    .from(userInteractions)
    .orderBy(desc(userInteractions.createdAt));

  const interactedMediaIds = recentInteractions.map(
    (interaction) => interaction.mediaId
  );

  if (recentInteractions.length === 0) {
    return {
      media: [],
      basedOn: null,
    };
  }

  const recentMedia = recentInteractions[0];

  // Step 2: Get the genres of the most recently watched media
  const genres = await db
    .select({ genre: mediaGenre.genre })
    .from(mediaGenre)
    .where(eq(mediaGenre.mediaId, recentMedia.mediaId));

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
      .where(
        and(
          inArray(mediaGenre.genre, genreList),
          not(
            inArray(
              media.id,
              similarMedia.map((m) => m.id)
            )
          )
        )
      )
      .groupBy(media.id)
      .orderBy(sql`COUNT(DISTINCT ${mediaGenre.genre}) DESC`) // Order by the number of genres the media matches
      .limit(16 - similarMedia.length);

    return {
      media: [...similarMedia, ...fallbackMedia],
      basedOn: recentMedia.title,
    };
  }

  return {
    media: similarMedia,
    basedOn: recentMedia.title,
  };
}

export async function getRandomMedia() {
  const [data] = await db
    .select()
    .from(media)
    .orderBy(sql`RAND()`)
    .limit(1);

  return data;
}

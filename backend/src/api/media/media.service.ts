import { conn, db } from "../../db/database.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TMedia, TReview } from "../../types/index.js";
import {
  users as UsersTable,
  likesReviews as likesReviewsTable,
  media,
  ratings,
  userReviews,
  users,
  remoteId,
  reviews,
  likes,
  mediaGenre,
} from "../../db/schema.js";
import { desc, eq, like, notInArray } from "drizzle-orm/expressions";
import { count, sql, avg, not, and } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";

export async function get_media_rating(media_id: number): Promise<number> {
  //Changed to Drizzle
  let [rows] = await db
    .select({ value: avg(ratings.rating) })
    .from(ratings)
    .where(sql`${ratings.mediaId} = ${media_id}`);

  if (rows["value"] === null) {
    throw Error("RATINGS AREN'T REAL");
  }
  return +rows["value"];
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
        media_id: media_id,
        user_id: user_id,
        comment: new_comment,
        rating: ratingId.id,
      })
      .onDuplicateKeyUpdate({
        set: {
          comment: new_comment,
          rating: ratingId.id,
          created_at: sql`CURRENT_TIMESTAMP`,
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
      media_id: userReviews.media_id,
      username: UsersTable.username,
      comment: userReviews.comment,
      created_at: userReviews.created_at,
      rating: ratings.rating,
      likes: count(likesReviewsTable.id).as("likes_count"),
    })
    .from(userReviews)
    .innerJoin(UsersTable, eq(userReviews.user_id, UsersTable.id))
    .leftJoin(likesReviewsTable, eq(userReviews.id, likesReviewsTable.reviewId))
    .innerJoin(ratings, eq(ratings.id, userReviews.rating))
    .where(eq(userReviews.media_id, media_id))
    .groupBy(userReviews.id)
    .orderBy(desc(userReviews.created_at))
    .limit(amount)
    .offset(offset);

  return rows satisfies TReview[];
}

export async function get_user_review(
  media_id: number,
  user_id: number
): Promise<TReview> {
  //changed to drizzle needed to change a few names to match TReview
  let [rows] = await db
    .select()
    .from(userReviews)
    .where(
      sql`${userReviews.media_id} = ${media_id} and ${userReviews.user_id} = ${user_id}`
    );

  if (rows === null) {
    throw Error("REVIEWS AREN'T REAL");
  }
  return rows;
}

// Try inserting the like; if it already exists, delete it instead.
export async function update_likes(media_id: number, user_id: number) {
  const [result] = await db
    .insert(likes)
    .ignore()
    .values({ mediaId: media_id, userId: user_id });

  // Check if a row was inserted; if not, delete it instead.
  if (result.affectedRows === 0) {
    // If the row wasn’t inserted (it already exists), delete it to "toggle" the like.
    await db
      .delete(likes)
      .where(
        sql`${likes.mediaId} = ${media_id} and ${likes.userId} = ${user_id}`
      );
  }
}

export async function is_liked(
  media_id: number,
  user_id: number
): Promise<boolean> {
  //changed to drizzle

  const [rows] = await db
    .select()
    .from(likes)
    .where(sql`${likes.mediaId} = ${media_id} and ${likes.userId} = ${user_id}`)
    .limit(1);

  if (!rows) return false;
  else return true;
}

export async function get_likes(media_id: number): Promise<number> {
  //changed to drizzle
  let [rows] = await db
    .select({ num: count() })
    .from(likes)
    .where(sql`${likes.mediaId} = ${media_id}`);

  return rows.num;
}

export async function getMostPopular() {
  //changed to drizzle

  let rows = await db
    .select()
    .from(media)
    .orderBy(desc(media.rating))
    .limit(15);

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
      thumbnail_url: media.thumbnailUrl,
      rating: media.rating,
      userId: users.id,
      userName: users.username,
      review: userReviews.comment,
      reviewRating: ratings.rating,
      created_at: userReviews.created_at,
    })
    .from(media)
    .innerJoin(userReviews, eq(media.id, userReviews.media_id))
    .innerJoin(users, eq(users.id, userReviews.user_id))
    .innerJoin(ratings, eq(ratings.id, userReviews.rating))
    .where(
      // Ensure only the most recent reviews for each media is selected. Still have to write raw sql for this one 🤕
      sql`UserReviews.created_at = (
        SELECT MAX(r.created_at)
        FROM UserReviews r
        WHERE r.media_id = UserReviews.media_id
      )`
    )
    .orderBy(desc(userReviews.created_at))
    .limit(8);

  return {
    status: "success",
    media: rows,
  };
}

export async function get_trending() {
  //changed to drizzle
  const WeightedMovies = db.$with("WeightedMovies").as(
    db
      .select({
        mediaId: media.id,
        mediaCategory: media.category,
        mediaTitle: media.title,
        mediaDescription: media.description,
        mediaRelease_Date: media.releaseDate,
        mediaAge_Rating: media.ageRating,
        mediaThumbnailURL: media.thumbnailUrl,
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

export async function get_new_for_you(user_id: number) {
  //Changed to drizzle
  const data = await db
    .selectDistinct()
    .from(media)
    .where(
      and(
        notInArray(
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
                .select({ mediaId: userReviews.media_id })
                .from(userReviews)
                .where(eq(userReviews.user_id, user_id))
            )
        ),
        sql`${media.releaseDate} <= CURDATE()`
      )
    )
    .orderBy(sql`RAND()`)
    .limit(15);

  return data;
}

// Get the users total number of likes, reviews, and ratings
export async function get_user_stats(user_id: number) {
  //changed to drizzle

  const like = await db.$count(likes, eq(likes.userId, user_id));
  const review = await db.$count(userReviews, eq(userReviews.user_id, user_id));
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

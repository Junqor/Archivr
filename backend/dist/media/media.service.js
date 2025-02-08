import { conn, db } from "../db/database.js";
import { reviews as ReviewsTable, users as UsersTable, likesReviews as likesReviewsTable, } from "../db/schema.js";
import { desc, eq } from "drizzle-orm/expressions";
import { count } from "drizzle-orm";
import { media, remoteId } from "../db/schema.js";
export async function update_rating(media_id, user_id, new_rating) {
    let [rows] = await conn.query("INSERT INTO Ratings (media_id, user_id, rating) VALUES (?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE rating = ?", [media_id, user_id, new_rating, new_rating]);
    return;
}
export async function get_media_rating(media_id) {
    let [rows] = await conn.query("SELECT AVG(rating) as avg FROM Reviews WHERE media_id=?;", [media_id]);
    if (rows[0].length == 0) {
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0].avg;
}
export async function get_user_rating(media_id, user_id) {
    let [rows] = await conn.query("SELECT rating as rat FROM Ratings WHERE media_id=? AND user_id=?;", [media_id, user_id]);
    if (rows[0].length == 0) {
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0][0].rat;
}
export async function update_review(media_id, user_id, new_comment, new_rating) {
    let [rows] = await conn.query("INSERT INTO Reviews (media_id,user_id,comment,rating) VALUES (?,?,?,?) " +
        "ON DUPLICATE KEY UPDATE comment = ?, rating = ?, created_at = CURRENT_TIMESTAMP", [media_id, user_id, new_comment, new_rating, new_comment, new_rating]);
    return;
}
export async function get_media_reviews(media_id, amount, offset) {
    let rows = await db
        .select({
        id: ReviewsTable.id,
        user_id: UsersTable.id,
        media_id: ReviewsTable.mediaId,
        username: UsersTable.username,
        comment: ReviewsTable.comment,
        created_at: ReviewsTable.createdAt,
        rating: ReviewsTable.rating,
        likes: count(likesReviewsTable.id).as("likes_count"),
    })
        .from(ReviewsTable)
        .innerJoin(UsersTable, eq(ReviewsTable.userId, UsersTable.id))
        .leftJoin(likesReviewsTable, eq(ReviewsTable.id, likesReviewsTable.reviewId))
        .where(eq(ReviewsTable.mediaId, media_id))
        .groupBy(ReviewsTable.id)
        .orderBy(desc(ReviewsTable.createdAt))
        .limit(amount)
        .offset(offset);
    return rows;
}
export async function get_user_review(media_id, user_id) {
    let [rows] = await conn.query("SELECT * FROM Reviews WHERE media_id=? AND user_id=?;", [media_id, user_id]);
    if (rows[0].length == 0) {
        throw Error("REVIEWS AREN'T REAL");
    }
    return rows[0];
}
// Try inserting the like; if it already exists, delete it instead.
export async function update_likes(media_id, user_id) {
    const [result] = await conn.query(`INSERT IGNORE INTO Likes (media_id, user_id) VALUES (?, ?)`, [media_id, user_id]);
    // Check if a row was inserted; if not, delete it instead.
    if (result.affectedRows === 0) {
        // If the row wasn’t inserted (it already exists), delete it to "toggle" the like.
        await conn.query("DELETE FROM Likes WHERE media_id = ? AND user_id = ?;", [
            media_id,
            user_id,
        ]);
    }
}
export async function is_liked(media_id, user_id) {
    const [rows] = await conn.query("SELECT 1 FROM Likes WHERE media_id = ? AND user_id = ? LIMIT 1;", [media_id, user_id]);
    return rows.length > 0;
}
export async function get_likes(media_id) {
    let [rows] = await conn.query("SELECT COUNT(*) as num FROM Likes WHERE media_id=?;", [media_id]);
    return rows[0].num ?? 0;
}
export async function getMostPopular() {
    //   let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    //     `SELECT
    //     Media.id,
    //     Media.category,
    //     Media.title,
    //     Media.description,
    //     Media.release_date,
    //     Media.age_rating,
    //     Media.thumbnail_url,
    //     Media.rating AS rating,
    //     COALESCE(AVG(Ratings.rating), 0) AS average_rating,
    //     COUNT(Ratings.rating) AS num_ratings,
    //     (
    //         (COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * COALESCE(AVG(Ratings.rating), 0) +
    //         (50 / (COUNT(Ratings.rating) + 50)) * (
    //             SELECT COALESCE(AVG(rating), 0) FROM Ratings
    //         )
    //     ) AS weighted_rating
    // FROM Media
    // LEFT JOIN Ratings ON Media.id = Ratings.media_id
    // GROUP BY Media.id
    // ORDER BY weighted_rating DESC
    // LIMIT 15;`
    //   );
    let [rows] = await conn.query(`SELECT * FROM Media ORDER BY rating DESC LIMIT 15;`);
    return {
        status: "success",
        media: rows,
    };
}
export async function get_recently_reviewed() {
    let [rows] = await conn.query(`SELECT DISTINCT
      Media.id,
      Media.title,
      Media.thumbnail_url,
      Media.Rating as rating,
      MAX(Reviews.created_at) AS created_at
    FROM Media
    INNER JOIN Reviews ON Media.id = Reviews.media_id
    GROUP BY Media.id, Media.title, Media.thumbnail_url
    ORDER BY created_at DESC
    LIMIT 8;`);
    return {
        status: "success",
        media: rows,
    };
}
export async function get_trending() {
    let [rows] = await conn.query(`WITH WeightedMovies AS (
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
    LIMIT 15;`);
    return {
        status: "success",
        media: rows,
    };
}
export async function get_new_for_you(user_id) {
    let [rows] = await conn.query(`SELECT DISTINCT Media.*
    FROM Media
    WHERE Media.id NOT IN (
      SELECT media_id FROM Ratings WHERE user_id = ?
      UNION
      SELECT media_id FROM Likes WHERE user_id = ?
      UNION
      SELECT media_id FROM Reviews WHERE user_id = ?
    )
    AND Media.release_date <= CURDATE()
    ORDER BY RAND()
    LIMIT 15;`, [user_id, user_id, user_id]);
    return {
        status: "success",
        media: rows,
    };
}
// Get the users total number of likes, reviews, and ratings
export async function get_user_stats(user_id) {
    let [rows] = await conn.query(`SELECT 
    (SELECT COUNT(*) FROM Likes WHERE user_id = ?) AS likes,
    (SELECT COUNT(*) FROM Reviews WHERE user_id = ?) AS reviews,
    (SELECT COUNT(*) FROM Ratings WHERE user_id = ?) AS ratings;`, [user_id, user_id, user_id]);
    return rows[0];
}
export const getMediaBackground = async (id) => {
    const [{ tvdbId, type }] = await db
        .select({ tvdbId: remoteId.tvdbId, type: media.category })
        .from(remoteId)
        .leftJoin(media, eq(media.id, remoteId.id))
        .where(eq(remoteId.id, id));
    if (!tvdbId) {
        throw new Error("Failed to fetch media background");
    }
    const url = `https://api4.thetvdb.com/v4/${type === "movie" ? "movies" : "series"}/${tvdbId}/extended`;
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
    const background = data.data.artworks.find((artwork) => artwork.image && artwork.image.includes("backgrounds"));
    // If no background is found, select the first image with fanart in the url
    if (!background) {
        return data.data.artworks.find((artwork) => artwork.image && artwork.image.includes("fanart"))?.image;
    }
    return background ? background.image : null;
};
// Get the first trailer link from thetvdb API for a media
export const getMediaTrailer = async (id) => {
    const [{ tvdbId, type }] = await db
        .select({ tvdbId: remoteId.tvdbId, type: media.category })
        .from(remoteId)
        .leftJoin(media, eq(media.id, remoteId.id))
        .where(eq(remoteId.id, id));
    if (!tvdbId) {
        throw new Error("Failed to fetch media trailer");
    }
    const url = `https://api4.thetvdb.com/v4/${type === "movie" ? "movies" : "series"}/${tvdbId}/extended`;
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
    const trailer = data.data.trailers.find((trailer) => trailer.url);
    return trailer ? trailer.url : null;
};

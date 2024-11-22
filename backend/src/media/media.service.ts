import { conn } from "../configs/digitalocean.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TMedia } from "../types/user.js";

export type TReview = {
  id: number;
  user_id: number;
  media_id: number;
  comment: string;
  created_at: Date;
};

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
  return rows[0][0].avg;
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
  new_comment: string
) {
  let [rows] = await conn.query(
    "INSERT INTO Reviews (media_id,user_id,comment) VALUES (?,?,?) " +
      "ON DUPLICATE KEY UPDATE comment = ?",
    [media_id, user_id, new_comment, new_comment]
  );
  return;
}

export async function get_media_reviews(
  media_id: number,
  amount: number,
  offset: number
): Promise<TReview[]> {
  let [rows] = await conn.query<(RowDataPacket & TReview)[]>(
    `SELECT Users.username, Reviews.comment, Reviews.created_at 
    FROM Reviews 
    INNER JOIN Users ON Reviews.user_id = Users.id 
    WHERE Reviews.media_id = ? 
    ORDER BY Reviews.created_at DESC
    LIMIT ? OFFSET ?;`,
    [media_id, amount, offset]
  );
  return rows;
}

export async function get_user_review(
  media_id: number,
  user_id: number
): Promise<TReview> {
  let [rows] = await conn.query<(RowDataPacket & TReview)[]>(
    "SELECT * FROM Reviews WHERE media_id=? AND user_id=?;",
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

export async function get_top_rated() {
  let [rows] = await conn.query<(RowDataPacket & TMedia)[]>(
    `SELECT 
      Media.id,
      Media.category,
      Media.title,
      Media.description,
      Media.release_date,
      Media.age_rating,
      Media.thumbnail_url,
      Media.genre,
      Media.Rating as rating,
      AVG(Ratings.rating) as average_rating,
      COUNT(Ratings.rating) as num_ratings,
      (
        (COUNT(Ratings.rating) / (COUNT(Ratings.rating) + 50)) * AVG(Ratings.rating) +
        (50 / (COUNT(Ratings.rating) + 50)) * (
          SELECT AVG(rating) FROM Ratings
        )
      ) AS weighted_rating
    FROM Media
    LEFT JOIN Ratings ON Media.id = Ratings.media_id
    GROUP BY Media.id
    ORDER BY weighted_rating DESC
    LIMIT 15;`
  );

  return {
    status: "success",
    media: rows,
  };
}

export async function get_recently_reviewed() {
  let [rows] = await conn.query<(RowDataPacket & TReview)[]>(
    `SELECT DISTINCT
      Media.id,
      Media.title,
      Media.thumbnail_url,
      Media.Rating as rating,
      MAX(Reviews.created_at) AS created_at
    FROM Media
    INNER JOIN Reviews ON Media.id = Reviews.media_id
    GROUP BY Media.id, Media.title, Media.thumbnail_url
    ORDER BY created_at DESC
    LIMIT 8;`
  );

  return {
    status: "success",
    media: rows,
  };
}

export async function get_trending() {
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
        Media.genre,
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
      genre,
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

export async function insert_media(media:TMedia){
  try{
  await conn.query<ResultSetHeader>(
    `INSERT INTO Media (category, title, description, release_date, age_rating, thumbnail_url, rating, genre) VALUES (?,?,?,?,?,?,?,?);`,
    [media.category, media.title, media.description, media.release_date, media.age_rating, media.thumbnail_url, media.rating, media.genre]
  );
  } 
  catch (error) {
    console.error(error);
    throw Error("One of your possibly many values was wrong in a way");
  }
}

// dont make it use the id property of media that would be stupid
export async function update_media(media_id:number, media:TMedia){
  try{
    await conn.query<ResultSetHeader>(
      `UPDATE Media SET category=?, title=?, description=?, release_date=?, age_rating=?, thumbnail_url=?, rating=?, genre=? WHERE id=?;`,
      [media.category, media.title, media.description, media.release_date, media.age_rating, media.thumbnail_url, media.rating, media.genre, media_id]
    );
    } 
    catch (error) {
      console.error(error);
      throw Error("One of your possibly many values was wrong in a way");
    }
}

export async function delete_media(media_id:number){
  try{
    await conn.query<ResultSetHeader>(
      `DELETE FROM Media WHERE id=?`,
      [media_id]
    );
    } 
    catch (error) {
      console.error(error);
      throw Error("There was a problem.");
    }
}

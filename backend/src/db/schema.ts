import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  foreignKey,
  primaryKey,
  unique,
  int,
  timestamp,
  datetime,
  mysqlEnum,
  varchar,
  text,
  date,
  float,
  check,
  smallint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Likes table
export const likes = mysqlTable(
  "Likes",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    mediaId: int("media_id")
      .references(() => media.id, {
        onDelete: "cascade",
      })
      .notNull(),
    likedAt: timestamp("liked_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "Likes_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
  ]
);

// Likes_Reviews table
export const likesReviews = mysqlTable(
  "Likes_Reviews",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    reviewId: int("review_id")
      .notNull()
      .references(() => reviews.id),
    createdAt: datetime("created_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Likes_Reviews_id" }),
    unique("Likes_Reviews_UNIQUE").on(table.userId, table.reviewId),
  ]
);

// Media table
export const media = mysqlTable(
  "Media",
  {
    id: int().autoincrement().notNull(),
    category: mysqlEnum([
      "movie",
      "tv_show",
      "music",
      "podcast",
      "book",
      "videogame",
    ]).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    release_date: date("release_date", { mode: "string" }),
    age_rating: varchar("age_rating", { length: 20 }),
    thumbnail_url: varchar("thumbnail_url", { length: 255 }),
    rating: float(),
    runtime: int(),
  },
  (table) => [
    index("Media_category_IDX").on(table.category),
    index("Media_rating_IDX").on(table.rating),
    primaryKey({ columns: [table.id], name: "Media_id" }),
    unique("unique_media").on(table.category, table.title, table.release_date),
  ]
);

export const mediaGenre = mysqlTable(
  "Media_Genre",
  {
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
    genre: varchar({ length: 100 }).notNull(),
    id: int().autoincrement().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Media_Genre_id" }),
    unique("Media_Genre_UNIQUE").on(table.genre, table.mediaId),
  ]
);

// Ratings table
export const ratings = mysqlTable(
  "Ratings",
  {
    id: int().autoincrement().notNull().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    rating: smallint({ unsigned: true }).notNull(),
    ratedAt: timestamp("rated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("Ratings_media_id_IDX").on(table.mediaId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "Ratings_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
    check("Ratings_CHECK", sql`((\`rating\` >= 1) and (\`rating\` <= 10))`),
  ]
);

// RemoteId table
export const remoteId = mysqlTable(
  "RemoteId",
  {
    id: int()
      .notNull()
      .references(() => media.id),
    tvdbId: int("tvdb_id"),
    tmdbId: int("tmdb_id"),
  },
  (table) => [
    index("RemoteId_tmdb_id_IDX").on(table.tmdbId),
    primaryKey({ columns: [table.id], name: "RemoteId_id" }),
  ]
);

// Reviews table
export const reviews = mysqlTable(
  "Reviews",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
    comment: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    rating: int(),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("Reviews_media_id_IDX").on(table.mediaId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "Reviews_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
  ]
);

// UserReviews table
export const userReviews = mysqlTable(
  "UserReviews",
  {
    id: int().autoincrement().notNull().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
    comment: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    ratingId: int("rating_id")
      .notNull()
      .references(() => ratings.id),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("Reviews_media_id_IDX").on(table.mediaId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "UserReviews_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
  ]
);

// Users table
export const users = mysqlTable(
  "Users",
  {
    id: int().autoincrement().notNull(),
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    salt: varchar({ length: 255 }).notNull(),
    role: mysqlEnum(["user", "admin"]).default("user").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Users_id" }),
    unique("email").on(table.email),
    unique("username").on(table.username),
  ]
);

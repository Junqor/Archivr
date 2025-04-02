import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  foreignKey,
  primaryKey,
  int,
  mysqlEnum,
  text,
  timestamp,
  index,
  unique,
  datetime,
  varchar,
  date,
  float,
  check,
  smallint,
  char,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const activity = mysqlTable(
  "Activity",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    activityType: mysqlEnum("activity_type", [
      "follow",
      "review",
      "like_review",
      "like_media",
      "reply",
    ]).notNull(),
    targetId: int("target_id").notNull(),
    relatedId: int("related_id"),
    content: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "Activity_id" })]
);

export const follows = mysqlTable(
  "Follows",
  {
    id: int().autoincrement().notNull().primaryKey(),
    followerId: int("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    followeeId: int("followee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("followee_id").on(table.followeeId),
    primaryKey({ columns: [table.id], name: "Follows_id" }),
    unique("follower_id").on(table.followerId, table.followeeId),
  ]
);

export const likes = mysqlTable(
  "Likes",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    likedAt: timestamp("liked_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "Likes_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
  ]
);

export const likesReviews = mysqlTable(
  "Likes_Reviews",
  {
    id: int().autoincrement().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    reviewId: int("review_id")
      .notNull()
      .references(() => userReviews.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    index("Likes_Reviews_Reviews_FK").on(table.reviewId, table.userId),
    primaryKey({ columns: [table.id], name: "Likes_Reviews_id" }),
    unique("Likes_Reviews_UNIQUE").on(table.userId, table.reviewId),
  ]
);

export const media = mysqlTable(
  "Media",
  {
    id: int().autoincrement().notNull().primaryKey(),
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

export const ratings = mysqlTable(
  "Ratings",
  {
    id: int().autoincrement().notNull().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
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

export const remoteId = mysqlTable(
  "RemoteId",
  {
    id: int()
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
    tvdbId: int("tvdb_id"),
    tmdbId: int("tmdb_id"),
  },
  (table) => [
    index("RemoteId_tmdb_id_IDX").on(table.tmdbId),
    primaryKey({ columns: [table.id], name: "RemoteId_id" }),
  ]
);

export const Replies = mysqlTable(
  "Replies",
  {
    id: int().autoincrement().notNull(),
    parent_id: int()
      .notNull()
      .references(() => userReviews.id, { onDelete: "cascade" }),
    user_id: int()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    text: text().notNull(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("parent_id").on(table.parent_id),
    index("user_id").on(table.user_id),
    primaryKey({ columns: [table.id], name: "Replies_id" }),
  ]
);

export const userReviews = mysqlTable(
  "UserReviews",
  {
    id: int().autoincrement().notNull().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
    comment: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    ratingId: int("rating_id")
      .notNull()
      .references(() => ratings.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    index("media_index").on(table.mediaId, table.userId),
    index("Reviews_media_id_IDX").on(table.mediaId),
    index("user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "UserReviews_id" }),
    unique("unique_media_user").on(table.mediaId, table.userId),
  ]
);

export const userSettings = mysqlTable(
  "User_Settings",
  {
    id: int().autoincrement().notNull(),
    user_id: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    status: char({ length: 128 }).default("").notNull(),
    bio: varchar({ length: 215 }).default("").notNull(),
    pronouns: char({ length: 32 }).default("").notNull(),
    location: char({ length: 128 }).default("").notNull(),
    social_instagram: char("social_instagram", { length: 255 })
      .default("")
      .notNull(),
    social_youtube: char("social_youtube", { length: 255 })
      .default("")
      .notNull(),
    social_tiktok: char("social_tiktok", { length: 255 }).default("").notNull(),
    public: tinyint().default(1).notNull(), // Should be boolean
    show_adult_content: tinyint("show_adult_content").default(0).notNull(),
    theme: mysqlEnum(["dark", "light"]).default("dark").notNull(), // Should be in localstorage
    fontSize: mysqlEnum("font_size", ["small", "normal", "large"])
      .default("normal")
      .notNull(),
    grant_personal_data: tinyint("grant_personal_data").default(1).notNull(),
    show_personalized_content: tinyint("show_personalized_content")
      .default(1)
      .notNull(),
  },
  (table) => [
    index("user_id").on(table.user_id),
    primaryKey({ columns: [table.id], name: "User_Settings_id" }),
  ]
);

export const lists = mysqlTable(
  "User_Media_Lists",
  {
    user_id: int()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    media_id: int()
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    list_name: varchar({ length: 20 }).notNull(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("media_id").on(table.media_id),
    primaryKey({
      columns: [table.user_id, table.media_id, table.list_name],
      name: "User_Media_Lists_user_id_media_id_list_name",
    }),
  ]
);

export const users = mysqlTable(
  "Users",
  {
    id: int().autoincrement().notNull(),
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    salt: varchar({ length: 255 }).notNull(),
    role: mysqlEnum(["user", "admin"]).default("user").notNull(),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    displayName: varchar("display_name", { length: 64 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Users_id" }),
    unique("email").on(table.email),
    unique("username").on(table.username),
  ]
);

export const userFavorites = mysqlTable(
  "User_Favorites",
  {
    id: int().autoincrement().notNull().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
    addedAt: timestamp("added_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("user_id_idx").on(table.userId),
    index("media_id_idx").on(table.mediaId),
    unique("unique_user_media").on(table.userId, table.mediaId),
  ]
);

import {
  mysqlTable,
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
  double,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const activity = mysqlTable("Activity", {
  id: int().autoincrement().notNull().primaryKey(),
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
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

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
    unique("follower_id").on(table.followerId, table.followeeId),
  ],
);

export const likes = mysqlTable(
  "Likes",
  {
    id: int().autoincrement().notNull().primaryKey(),
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
    unique("unique_media_user").on(table.mediaId, table.userId),
  ],
);

export const likesReviews = mysqlTable(
  "Likes_Reviews",
  {
    id: int().autoincrement().notNull().primaryKey(),
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
    unique("Likes_Reviews_UNIQUE").on(table.userId, table.reviewId),
  ],
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
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => [
    index("Media_category_IDX").on(table.category),
    index("Media_rating_IDX").on(table.rating),
    unique("unique_media").on(table.category, table.title, table.release_date),
  ],
);

export const mediaGenre = mysqlTable(
  "Media_Genre",
  {
    id: int().autoincrement().notNull().primaryKey(),
    mediaId: int("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" }),
    genre: varchar({ length: 100 }).notNull(),
  },
  (table) => [unique("Media_Genre_UNIQUE").on(table.genre, table.mediaId)],
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
    unique("unique_media_user").on(table.mediaId, table.userId),
    check("Ratings_CHECK", sql`((\`rating\` >= 1) and (\`rating\` <= 10))`),
  ],
);

export const remoteId = mysqlTable(
  "RemoteId",
  {
    id: int()
      .notNull()
      .references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" })
      .primaryKey(),
    tvdbId: int("tvdb_id"),
    tmdbId: int("tmdb_id"),
  },
  (table) => [index("RemoteId_tmdb_id_IDX").on(table.tmdbId)],
);

export const Replies = mysqlTable(
  "Replies",
  {
    id: int().autoincrement().notNull().primaryKey(),
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
  ],
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
    unique("unique_media_user").on(table.mediaId, table.userId),
  ],
);

export const userSettings = mysqlTable(
  "User_Settings",
  {
    id: int().autoincrement().notNull().primaryKey(),
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
  (table) => [index("user_id").on(table.user_id)],
);

export const lists = mysqlTable(
  "Lists",
  {
    id: int().autoincrement().notNull().primaryKey(),
    user_id: int()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    media_id: int()
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    list_name: mysqlEnum(["completed", "planning", "watching"]).notNull(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_lists_media_id").on(table.media_id),
    unique("unique_lists").on(table.user_id, table.media_id, table.list_name),
  ],
);

export const users = mysqlTable("Users", {
  id: int().autoincrement().notNull().primaryKey(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  salt: varchar({ length: 255 }).notNull(),
  role: mysqlEnum(["user", "admin"]).default("user").notNull(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  displayName: varchar("display_name", { length: 64 }),
});

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
    order: double("order").notNull(),
  },
  (table) => [
    index("user_id_idx").on(table.userId),
    index("media_id_idx").on(table.mediaId),
    unique("unique_user_media").on(table.userId, table.mediaId),
  ],
);

export const moderatorActions = mysqlTable("Moderator_Actions", {
  id: int().autoincrement().notNull().primaryKey(),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  action_type: varchar("action_type", { length: 255 }).notNull(),
  message: text("message"),
  expiry_date: timestamp("expiry_date", { mode: "string" }),
  pardon_timestamp: timestamp("pardon_timestamp", { mode: "string" }),
});

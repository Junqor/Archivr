import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, primaryKey, unique, int, timestamp, mysqlEnum, varchar, text, date, float, check, smallint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const likes = mysqlTable("Likes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").references(() => users.id, { onDelete: "cascade" } ),
	mediaId: int("media_id").references(() => media.id, { onDelete: "cascade" } ),
	likedAt: timestamp("liked_at", { mode: 'string' }).defaultNow(),
},
(table) => [
	index("media_index").on(table.mediaId, table.userId),
	index("user_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "Likes_id"}),
	unique("unique_media_user").on(table.mediaId, table.userId),
]);

export const media = mysqlTable("Media", {
	id: int().autoincrement().notNull(),
	category: mysqlEnum(['movie','tv_show','music','podcast','book','videogame']).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	releaseDate: date("release_date", { mode: 'string' }),
	ageRating: varchar("age_rating", { length: 20 }),
	thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
	rating: float(),
	runtime: int(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Media_id"}),
	unique("unique_media").on(table.category, table.title, table.releaseDate),
]);

export const mediaGenre = mysqlTable("Media_Genre", {
	mediaId: int("media_id").notNull().references(() => media.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	genre: varchar({ length: 100 }).notNull(),
	id: int().autoincrement().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Media_Genre_id"}),
	unique("Media_Genre_UNIQUE").on(table.genre, table.mediaId),
]);

export const ratings = mysqlTable("Ratings", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").references(() => users.id, { onDelete: "cascade" } ),
	mediaId: int("media_id").references(() => media.id, { onDelete: "cascade" } ),
	rating: smallint({ unsigned: true }),
	ratedAt: timestamp("rated_at", { mode: 'string' }).defaultNow(),
},
(table) => [
	index("media_index").on(table.mediaId, table.userId),
	index("user_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "Ratings_id"}),
	unique("unique_media_user").on(table.mediaId, table.userId),
	check("Ratings_chk_1", sql`((\`rating\` >= 1) and (\`rating\` <= 5))`),
]);

export const remoteId = mysqlTable("RemoteId", {
	id: int().notNull().references(() => media.id),
	tvdbId: int("tvdb_id"),
	tmdbId: int("tmdb_id"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "RemoteId_id"}),
]);

export const reviews = mysqlTable("Reviews", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").references(() => users.id, { onDelete: "cascade", onUpdate: "restrict" } ),
	mediaId: int("media_id").references(() => media.id, { onDelete: "cascade", onUpdate: "restrict" } ),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	rating: int(),
},
(table) => [
	index("media_index").on(table.mediaId, table.userId),
	index("user_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "Reviews_id"}),
	unique("unique_media_user").on(table.mediaId, table.userId),
]);

export const users = mysqlTable("Users", {
	id: int().autoincrement().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	salt: varchar({ length: 255 }).notNull(),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Users_id"}),
	unique("username").on(table.username),
	unique("email").on(table.email),
]);

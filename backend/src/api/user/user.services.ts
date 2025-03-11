import { conn, db } from "../../db/database.js";
import { RowDataPacket } from "mysql2";
import { Jimp } from "jimp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../configs/s3.js";
import fs from "fs";
import {
  media,
  users,
  userSettings,
  follows,
  userReviews,
  likes,
  userFavorites,
} from "../../db/schema.js";
import { logger } from "../../configs/logger.js";
import { z } from "zod";
import { updateSettingsSchema } from "./user.route.js";
import { count, sql } from "drizzle-orm";
import { getUserLikes } from "../likes/likes.service.js";
import { getUserReviews } from "../reviews/reviews.service.js";
import { getUserActivity } from "../activity/activity.service.js";
import { serverConfig } from "../../configs/secrets.js";
import { desc, asc, eq, inArray, and } from "drizzle-orm/expressions";

export type TUserSettings = {
  displayName: string | null;
  status: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_tiktok: string | null;
  public: number | null;
  show_adult_content: number | null;
  theme: string | null;
  font_size: string | null;
  grant_personal_data: number | null;
  show_personalized_content: number | null;
};
export async function getUserSettings(user_id: number) {
  const settings = await db
    .select({
      displayName: users.displayName || "",
      status: userSettings.status,
      bio: userSettings.bio,
      pronouns: userSettings.pronouns,
      location: userSettings.location,
      social_instagram: userSettings.social_instagram,
      social_youtube: userSettings.social_youtube,
      social_tiktok: userSettings.social_tiktok,
      public: userSettings.public,
      show_adult_content: userSettings.show_adult_content,
      theme: userSettings.theme,
      font_size: userSettings.fontSize,
      grant_personal_data: userSettings.grant_personal_data,
      show_personalized_content: userSettings.show_personalized_content,
    })
    .from(users)
    .leftJoin(userSettings, eq(users.id, userSettings.user_id))
    .where(eq(users.id, user_id));

  if (settings.length === 0) {
    throw new Error("User not found");
  }

  return settings[0];
}

// ! Todo: add Follows
export async function getProfile(username: string) {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
      displayName: users.displayName,
      tiktok: userSettings.social_tiktok,
      youtube: userSettings.social_youtube,
      instagram: userSettings.social_instagram,
      bio: userSettings.bio,
      pronouns: userSettings.pronouns,
      location: userSettings.location,
      status: userSettings.status,
    })
    .from(users)
    .leftJoin(userSettings, eq(userSettings.user_id, users.id))
    .where(eq(users.username, username));
  if (user.length === 0) {
    throw new Error("User not found");
  }
  return user[0];
}

export async function getUserSettingsForSettingsContext(user_id: number) {
  const [result] = await conn.query<(RowDataPacket & number)[]>(
    "SELECT " +
      "Users.display_name, " +
      "Users.avatar_url, " +
      "User_Settings.show_adult_content, " +
      "User_Settings.theme, " +
      "User_Settings.font_size, " +
      "User_Settings.grant_personal_data, " +
      "User_Settings.show_personalized_content " +
      "FROM User_Settings " +
      "INNER JOIN Users ON Users.id = User_Settings.user_id " +
      "WHERE user_id = ?;",
    [user_id]
  );
  return result[0];
}

export async function getAvatarUrl(user_id: number) {
  const result = await db
    .select({ avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, user_id));
  return result[0];
}

export async function setUserSettings(
  user_id: number,
  settings: z.infer<typeof updateSettingsSchema>
) {
  const { displayName, ...otherSettings } = settings;

  await db.transaction(async (tx) => {
    await tx.update(users).set({ displayName }).where(eq(users.id, user_id));
    await tx
      .update(userSettings)
      .set({ ...otherSettings })
      .where(eq(userSettings.user_id, user_id));
  });
}

export async function setPfp(
  user_id: number,
  file: Express.Multer.File | undefined
) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    // load file into jimp
    const image = await Jimp.read(file.path);
    // resize image
    image.resize({ w: 256, h: 256 });
    // save image to jpeg and compress it to hell
    const blob = await image.getBuffer("image/jpeg", { quality: 80.0 });

    fs.unlink(file.path, () => {});

    // send the file all at once
    await s3Client.send(
      new PutObjectCommand({
        Body: blob,
        Bucket: "archivr-pfp",
        Key: "pfp-" + user_id + ".jpeg",
        ContentType: "image/jpeg",
      })
    );

    const avatarUrl = `https://archivr-pfp.${serverConfig.S3_REGION}.${serverConfig.S3_HOST}/pfp-${user_id}.jpeg`;

    // Update the user's pfp in the database
    const rows = await db
      .update(users)
      .set({
        avatarUrl,
      })
      .where(eq(users.id, user_id));
    return avatarUrl;
  } catch (error) {
    if (file) fs.unlink(file.path, () => {});
    throw error;
  }
}

// New Profile Page Function
export async function getProfilePage(user_id: number) {
  // PFP link, display name, pronouns, username, location, bio, socials, # of followers, # of following, # of reviews
  const [profile] = await db
    .select({
      id: users.id,
      avatarUrl: users.avatarUrl,
      displayName: users.displayName,
      pronouns: userSettings.pronouns,
      username: users.username,
      location: userSettings.location,
      bio: userSettings.bio,
      tiktok: userSettings.social_tiktok,
      youtube: userSettings.social_youtube,
      instagram: userSettings.social_instagram,
    })
    .from(users)
    .leftJoin(userSettings, eq(users.id, userSettings.user_id))
    .where(eq(users.id, user_id))
    .limit(1);

  if (!profile) {
    throw new Error("User not found");
  }

  // Followers
  const [{ count: follower_count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(follows)
    .where(eq(follows.followeeId, user_id));

  // Following
  const [{ count: following_count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(follows)
    .where(eq(follows.followerId, user_id));

  // Reviews
  const [{ count: review_count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(userReviews)
    .where(eq(userReviews.userId, user_id));

  return {
    ...profile,
    follower_count,
    following_count,
    review_count,
  };
}

// Get all data needed for profile tab
export async function getProfileTab(user_id: number) {
  const likes = await getUserLikes(user_id, 4);
  const recentReviews = await getUserReviews(user_id, 5);
  const popularReviews = await getUserReviews(user_id, 5, 0, "review_likes");
  const recentActivity = await getUserActivity(user_id, 5);

  return {
    likes,
    recentReviews,
    popularReviews,
    recentActivity,
  };
}

const sortFields = {
  "follows.created_at": follows.createdAt,
  "users.username": users.username,
};

export async function getUserFollows(
  user_id: number,
  type: "followers" | "following" = "followers",
  limit = 30,
  offset = 0,
  sort_by = "follows.created_at",
  sort_order = "desc"
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  if (!(sort_by in sortFields)) {
    throw new Error("Invalid sort field");
  }

  let orderByClause =
    sort_order === "asc"
      ? asc(sortFields[sort_by as keyof typeof sortFields])
      : desc(sortFields[sort_by as keyof typeof sortFields]);
  const targetColumn =
    type === "followers" ? follows.followerId : follows.followeeId;
  const userColumn =
    type === "followers" ? follows.followeeId : follows.followerId;

  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      createdAt: follows.createdAt,
    })
    .from(follows)
    .innerJoin(users, eq(users.id, targetColumn))
    .where(eq(userColumn, user_id))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);
}

export async function getUserFollowsExtended(
  user_id: number,
  type: "followers" | "following" = "followers",
  limit = 30,
  offset = 0,
  sort_by = "follows.created_at",
  sort_order = "desc"
) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid user id");
  }

  if (!(sort_by in sortFields)) {
    throw new Error("Invalid sort field");
  }

  let orderByClause =
    sort_order === "asc"
      ? asc(sortFields[sort_by as keyof typeof sortFields])
      : desc(sortFields[sort_by as keyof typeof sortFields]);
  const targetColumn =
    type === "followers" ? follows.followerId : follows.followeeId;
  const userColumn =
    type === "followers" ? follows.followeeId : follows.followerId;

  // Get list of follows with user info
  const followsData = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      pronouns: userSettings.pronouns,
    })
    .from(follows)
    .innerJoin(users, eq(users.id, targetColumn))
    .leftJoin(userSettings, eq(users.id, userSettings.user_id))
    .where(eq(userColumn, user_id))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // Fetch counts individually per user
  const userIds = followsData.map((follow) => follow.id);

  if (userIds.length === 0) {
    return [];
  }

  const followerCounts = await db
    .select({ userId: follows.followeeId, count: sql<number>`COUNT(*)` })
    .from(follows)
    .where(inArray(follows.followeeId, userIds))
    .groupBy(follows.followeeId);

  const followingCounts = await db
    .select({ userId: follows.followerId, count: sql<number>`COUNT(*)` })
    .from(follows)
    .where(inArray(follows.followerId, userIds))
    .groupBy(follows.followerId);

  const reviewCounts = await db
    .select({ userId: userReviews.userId, count: sql<number>`COUNT(*)` })
    .from(userReviews)
    .where(inArray(userReviews.userId, userIds))
    .groupBy(userReviews.userId);

  const likeCounts = await db
    .select({ userId: likes.userId, count: sql<number>`COUNT(*)` })
    .from(likes)
    .where(inArray(likes.userId, userIds))
    .groupBy(likes.userId);

  // Convert counts to a lookup map for quick access
  const followerCountMap = Object.fromEntries(
    followerCounts.map((item) => [item.userId, item.count])
  );
  const followingCountMap = Object.fromEntries(
    followingCounts.map((item) => [item.userId, item.count])
  );
  const reviewCountMap = Object.fromEntries(
    reviewCounts.map((item) => [item.userId, item.count])
  );
  const likeCountMap = Object.fromEntries(
    likeCounts.map((item) => [item.userId, item.count])
  );

  // Append individual counts to each follow
  return followsData.map((follow) => ({
    ...follow,
    follower_count: followerCountMap[follow.id] || 0,
    following_count: followingCountMap[follow.id] || 0,
    review_count: reviewCountMap[follow.id] || 0,
    like_count: likeCountMap[follow.id] || 0,
  }));
}

// User adds a media to their favorites
export async function addFavorite(user_id: number, media_id: number) {
  // Check if the user has less than 4 favorites
  const favoriteCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(userFavorites)
    .where(eq(userFavorites.userId, user_id));

  if (favoriteCount[0].count >= 4) {
    throw new Error("You can only have 4 favorites at a time");
  }

  // Check if the user already has the media favorited
  const existingFavorite = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, user_id),
        eq(userFavorites.mediaId, media_id)
      )
    );

  if (existingFavorite.length > 0) {
    throw new Error("Media already favorited");
  }

  // Add the favorite
  await db.insert(userFavorites).values({ userId: user_id, mediaId: media_id });
}

// User removes a media from their favorites
export async function removeFavorite(user_id: number, media_id: number) {
  // Check if the user has the media favorited
  const existingFavorite = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, user_id),
        eq(userFavorites.mediaId, media_id)
      )
    );

  if (existingFavorite.length === 0) {
    throw new Error("Media not favorited");
  }

  await db
    .delete(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, user_id),
        eq(userFavorites.mediaId, media_id)
      )
    );
}

// Get a user's favorites
export async function getUserFavorites(user_id: number) {
  // id, media_id, title, thumbnail_url, added_at
  return db
    .select({
      id: userFavorites.id,
      media_id: userFavorites.mediaId,
      title: media.title,
      thumbnail_url: media.thumbnail_url,
      added_at: userFavorites.addedAt,
    })
    .from(userFavorites)
    .innerJoin(media, eq(media.id, userFavorites.mediaId))
    .where(eq(userFavorites.userId, user_id));
}

// Check if a user has favorited a media
export async function checkFavorite(user_id: number, media_id: number) {
  const favorites = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, user_id),
        eq(userFavorites.mediaId, media_id)
      )
    );

  return favorites.length > 0;
}

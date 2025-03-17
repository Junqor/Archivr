import z, { ZodError } from "zod";
import { Router } from "express";
import {
  getUserSettings,
  getUserSettingsForSettingsContext,
  setUserSettings,
  setPfp,
  getProfile,
  getAvatarUrl,
  getProfilePage,
  getProfileTab,
  getUserFollows,
  getUserFollowsExtended,
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
  getUserIdFromUsername,
} from "./user.services.js";
import bodyParser from "body-parser";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { serverConfig } from "../../configs/secrets.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { fileUploadMiddleware } from "../../middleware/fileUpload.middleware.js";
import { s3Client } from "../../configs/s3.js";
import { logger } from "../../configs/logger.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const __dirname = import.meta.dirname;

export const userRouter = Router();

userRouter.get(
  "/settings",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const settings = await getUserSettings(user.id);
    res.json({ status: "success", settings: settings });
  })
);

userRouter.get(
  "/get-user-settings-for-settings-context",
  authenticateToken,
  async (req, res) => {
    try {
      const values = await getUserSettingsForSettingsContext(
        res.locals.user.id
      );
      res.json({ status: "success", settings: values });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  }
);

userRouter.get(
  "/profile/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;
    const profile = await getProfile(username);
    res.json({ status: "success", profile: profile });
  })
);

export const updateSettingsSchema = z.object({
  displayName: z.string(),
  status: z.string(),
  bio: z.string(),
  pronouns: z.string(),
  location: z.string(),
  social_instagram: z.string(),
  social_youtube: z.string(),
  social_tiktok: z.string(),
  public: z.number(),
  show_adult_content: z.number(),
  theme: z.enum(["light", "dark"]),
  font_size: z.enum(["small", "normal", "large"]),
  grant_personal_data: z.number(),
  show_personalized_content: z.number(),
});

userRouter.post(
  "/settings",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const newSettings = updateSettingsSchema.parse(req.body);
    await setUserSettings(user.id, newSettings);
    res.json({ status: "success" });
  })
);

userRouter.get(
  "/pfp/:userId",
  asyncHandler(async (req, res) => {
    const user_id = parseInt(req.params.userId);
    if (!user_id) throw new Error("user_id is not real.");
    const { avatarUrl } = await getAvatarUrl(user_id);
    if (avatarUrl) {
      res.redirect(avatarUrl);
    } else {
      res.sendFile(__dirname + "/assets/default" + (user_id % 5) + ".png");
    }
  })
);

userRouter.post(
  "/set-pfp",
  authenticateToken,
  fileUploadMiddleware.single("avatar"),
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const avatarUrl = await setPfp(user.id, req.file);
    res.json({ status: "success", avatarUrl });
  })
);

// (GET /user/profile-page/:userId)
// Get data needed to construct a user's hero and nav sections on their profile page
userRouter.get(
  "/profile-page/:userId",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profilePage = await getProfilePage(userId);
      res.json({ status: "success", profilePage });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/profile-tab/:userId)
// Get data needed to construct a user's profile tab
userRouter.get(
  "/profile-tab/:userId",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profileTab = await getProfileTab(userId);
      res.json({ status: "success", profileTab });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/:userId/:type?limit=15&offset=0&sort_by=follows.createdAt&sort_order=desc)
// Get a user's follows
userRouter.get(
  "/:userId/:type(followers|following)",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.params.type as "followers" | "following";
      const limit = parseInt(req.query.limit as string) || 15;
      const offset = parseInt(req.query.offset as string) || 0;
      const sort_by = req.query.sort_by as "follows.createdAt";
      const sort_order = req.query.sort_order as "desc";
      const follows = await getUserFollows(
        userId,
        type,
        limit,
        offset,
        sort_by,
        sort_order
      );
      res.json({ status: "success", follows });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/:userId/:type/extended?limit=15&offset=0&sort_by=follows.createdAt&sort_order=desc)
// Get a user's follows with extended info
userRouter.get(
  "/:userId/:type(followers|following)/extended",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.params.type as "followers" | "following";
      const limit = parseInt(req.query.limit as string) || 15;
      const offset = parseInt(req.query.offset as string) || 0;
      const sort_by = req.query.sort_by as "follows.createdAt";
      const sort_order = req.query.sort_order as "desc";
      const follows = await getUserFollowsExtended(
        userId,
        type,
        limit,
        offset,
        sort_by,
        sort_order
      );
      res.json({ status: "success", follows });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (POST /user/add-favorite)
// Add a favorite media
userRouter.post(
  "/add-favorite",
  authenticateToken,
  asyncHandler(async (req, res) => {
    try {
      const { user } = res.locals;
      const { mediaId } = req.body;
      await addFavorite(user.id, mediaId);
      res.json({ status: "success" });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (POST /user/remove-favorite)
// Remove a favorite media
userRouter.post(
  "/remove-favorite",
  authenticateToken,
  asyncHandler(async (req, res) => {
    try {
      const { user } = res.locals;
      const { mediaId } = req.body;
      await removeFavorite(user.id, mediaId);
      res.json({ status: "success" });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/get-favorites/:userId)
// Get a user's favorite media
userRouter.get(
  "/get-favorites/:userId",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await getUserFavorites(userId);
      res.json({ status: "success", favorites });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/check-favorite/:userId/:mediaId)
// Check if a media is a user's favorite
userRouter.get(
  "/check-favorite/:userId/:mediaId",
  asyncHandler(async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const mediaId = parseInt(req.params.mediaId);
      const isFavorite = await checkFavorite(userId, mediaId);
      res.json({ status: "success", isFavorite });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

// (GET /user/:username/id)
// Get a user's id by username
userRouter.get(
  "/:username/id",
  asyncHandler(async (req, res) => {
    try {
      const username = req.params.username;
      const userId = await getUserIdFromUsername(username);
      res.json({ status: "success", userId });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message: (error as Error).message,
      });
    }
  })
);

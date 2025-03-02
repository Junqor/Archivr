import z, { ZodError } from "zod";
import { Router } from "express";
import {
  getUserSettings,
  getUserSettingsForSettingsContext,
  setUserSettings,
  setPfp,
  getProfile,
  getAvatarUrl,
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

import z, { ZodError } from "zod";
import { Router } from "express";
import {
  getUserSettings,
  getUserProfileSettings,
  getUserSettingsForSettingsContext,
  setUserSettings,
  setPfp,
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

userRouter.get("/get-user-settings", authenticateToken, async (req, res) => {
  try {
    const values = await getUserSettings(res.locals.user.id);
    res.json({ status: "success", settings: values });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message: (error as Error).message,
    });
  }
});

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

userRouter.get("/get-user-profile-settings/:userId", async (req, res) => {
  try {
    const user_id = parseInt(req.params.userId);
    const values = await getUserProfileSettings(user_id);
    res.json({ status: "success", settings: values });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message: (error as Error).message,
    });
  }
});

const setSettingsSchema = z.object({
  settings: z.map(z.string(), z.string()),
});

userRouter.post(
  "/set-user-settings",
  authenticateToken,
  bodyParser.text(),
  async (req, res) => {
    try {
      let body = JSON.parse(req.body, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (value.dataType === "Map") {
            return new Map(value.value);
          }
        }
        return value;
      });
      body = setSettingsSchema.parse(body);
      await setUserSettings(res.locals.user.id, body.settings);
      res.json({ status: "success" });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: "failed",
        message:
          error instanceof ZodError ? "Invalid body" : (error as Error).message,
      });
    }
  }
);

userRouter.get("/pfp/:userId", async (req, res) => {
  try {
    const user_id = parseInt(req.params.userId);
    if (!user_id) throw new Error("user_id is not real.");
    const image_url =
      "https://archivr-pfp." +
      serverConfig.S3_REGION +
      "." +
      serverConfig.S3_HOST +
      "/pfp-" +
      user_id.toString() +
      ".jpeg";
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: "archivr-pfp",
          Key: "pfp-" + user_id.toString() + ".jpeg",
        })
      );
      res.redirect(image_url);
    } catch {
      res.sendFile(__dirname + "/assets/default" + (user_id % 5) + ".png");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message: (error as Error).message,
    });
  }
});

userRouter.post(
  "/set-pfp",
  authenticateToken,
  fileUploadMiddleware.single("avatar"),
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    await setPfp(user.id, req.file);
    res.json({ status: "success" });
  })
);

import z, { ZodError } from "zod";
import { Router } from "express";
import {
  getUserSettings,
  getUserProfileSettings,
  getUserSettingsForSettingsContext,
  setUserSettings,
} from "./user.services.js";
import bodyParser from "body-parser";
import {
  authenticateToken,
  authenticateTokenFunc,
} from "../../middleware/authenticateToken.js";
import multer from "multer";
import { serverConfig } from "../../configs/secrets.js";
import { tmpDir } from "../../utils/tmpDir.js";
import { Jimp } from "jimp";
import fs from "fs";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
const __dirname = import.meta.dirname;

const s3Client = new S3Client({
  region: "sfo3",
  endpoint: "https://" + serverConfig.S3_REGION + "." + serverConfig.S3_HOST,
  credentials: {
    accessKeyId: serverConfig.S3_ACCESS_TOKEN,
    secretAccessKey: serverConfig.S3_SECRET_TOKEN,
  },
});

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

const uploadPfp = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tmpDir.name);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
  fileFilter: function (req, file, cb) {
    var allowedMimes = [
      "image/jpeg",
      "image/bmp",
      "image/png",
      "image/tiff",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only jpg, png and webp image files are allowed."
        )
      );
    }
  },
  limits: {
    files: 1,
    fileSize: 1024 * 1024,
  },
});

const setPfpSchema = z.object({
  Authorization: z.string(),
});

userRouter.post("/set-pfp", uploadPfp.single("pfp"), async (req, res) => {
  try {
    setPfpSchema.parse(req.body);
    const authToken = authenticateTokenFunc(req.body.Authorization);
    if (!authToken) {
      if (req.file) fs.unlink(req.file.path, () => {});
      throw new Error("Authentication failed");
    }
    if (req.file) {
      // load file into jimp
      const image = await Jimp.read(req.file.path);
      // resize image
      image.resize({ w: 256, h: 256 });
      // save image to jpeg and compress it to hell
      const blob = await image.getBuffer("image/jpeg", { quality: 80.0 });

      fs.unlink(req.file.path, () => {});

      // send the file all at once
      await s3Client.send(
        new PutObjectCommand({
          Body: blob,
          Bucket: "archivr-pfp",
          Key: "pfp-" + authToken.user.id.toString() + ".jpeg",
        })
      );
    }
    res.redirect(serverConfig.FRONTEND_URL + "/settings");
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message:
        error instanceof ZodError ? "Invalid body" : (error as Error).message,
    });
  }
});

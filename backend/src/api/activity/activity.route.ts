import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import {
  followUser,
  getFollowingActivity,
  getGlobalActivity,
  getTopUserMedia,
} from "./activity.service.js";
import { z } from "zod";

export const activityRouter = Router();

const activityRouteSchema = z.object({
  page: z.coerce.number(),
});

// /api/activity
// Get global activity
activityRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page } = activityRouteSchema.parse(req.query);
    const activity = await getGlobalActivity(page);
    res.json({ status: "success", activity: activity });
  })
);

// /api/activity/following
// Get activity of people the user is following
activityRouter.get(
  "/following",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const { page } = activityRouteSchema.parse(req.query);
    const activity = await getFollowingActivity(user.id, page);
    res.json({ status: "success", activity: activity });
  })
);

const followRouteSchema = z.object({
  followeeId: z.number(),
});

activityRouter.post(
  "/follow",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const { followeeId } = followRouteSchema.parse(req.body);
    await followUser(user.id, followeeId);
    res.json({ status: "success" });
  })
);

activityRouter.get(
  "/top-user-media",
  asyncHandler(async (req, res) => {
    const media = await getTopUserMedia();
    res.json({ status: "success", media: media });
  })
);

import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import {
  followUser,
  getFollowingActivity,
  getGlobalActivity,
  getTopUserMedia,
  getUserTopMedia,
  getUserActivity,
} from "./activity.service.js";
import { z } from "zod";

export const activityRouter = Router();

const activityLimitOffsetSchema = z.object({
  limit: z.coerce.number().optional().default(15),
  offset: z.coerce.number().optional().default(0),
});

// /api/activity/global
// Get global activity
activityRouter.get(
  "/global",
  asyncHandler(async (req, res) => {
    const { limit, offset } = activityLimitOffsetSchema.parse(req.query);
    const activity = await getGlobalActivity(limit, offset);
    res.json({ status: "success", activity: activity });
  })
);

// /api/activity/:userId/following
// Get activity of people the user is following
activityRouter.get(
  "/user/:userId(\\d+)/following",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { limit, offset } = activityLimitOffsetSchema.parse(req.query);
    const activity = await getFollowingActivity(userId, limit, offset);
    res.json({ status: "success", activity: activity });
  })
);

const followRouteSchema = z.object({
  followeeId: z.number(),
});

// /api/activity/follow
// Follow a user
activityRouter.post(
  "/follow",
  authenticateToken,
  asyncHandler(async (req, res) => {
    try {
      const { user } = res.locals;
      const { followeeId } = followRouteSchema.parse(req.body);
      await followUser(user.id, followeeId);
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

// (GET /activity/top-user-media?limit=10)
// Get top media for users
activityRouter.get(
  "/top-user-media",
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const media = await getTopUserMedia(limit);
    res.json({ status: "success", media: media });
  })
);

// (GET /activity/user/:userId/top-media)
// Get top media for a user
activityRouter.get(
  "/user/:userId/top-media",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 10;
    const media = await getUserTopMedia(userId, limit);
    res.json({ status: "success", media: media });
  })
);

// (GET /activity/user/:userId?limit=15&offset=0)
// Get activity for a user
activityRouter.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { limit, offset } = activityLimitOffsetSchema.parse(req.query);
    const activity = await getUserActivity(userId, limit, offset);
    res.json({ status: "success", activity: activity });
  })
);

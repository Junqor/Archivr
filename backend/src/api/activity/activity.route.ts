import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { getFollowingActivity, getGlobalActivity } from "./activity.service.js";
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
    res.json({ status: "success", data: activity });
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
    res.json({ status: "success", data: activity });
  })
);

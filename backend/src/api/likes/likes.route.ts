import { Router } from "express";
import { getUserLikes } from "./likes.service.js";
import { z } from "zod";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export const likesRouter = Router();

// (GET /likes/user/:userId?limit=4&offset=0&sort_by=likes.liked_at&sort_order=desc&ratingMax=10&genre=)
// get likes for a user
likesRouter.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 4;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort_by = req.query.sort_by as
      | "When Liked"
      | "Media Title"
      | "Media Rating"
      | "Media Release Date"
      | "Media Runtime"
      | "Rating"
      | undefined;
    const sort_order = req.query.sort_order as string;
    const ratingMax = parseInt(req.query.ratingMax as string) || 10;
    const genre = req.query.genre as string;

    const likes = await getUserLikes(
      userId,
      limit,
      offset,
      sort_by,
      sort_order,
      ratingMax,
      genre
    );
    res.json({ status: "success", data: likes });
  })
);

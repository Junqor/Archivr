import { Router } from "express";
import { get_likes, is_liked, update_likes } from "./database";
import { z } from "zod";

export const mediaRouter = Router();

const updateLikesBodySchema = z.object({
  media_id: z.number(),
  user_id: z.number(),
});

// (POST /media/like)
mediaRouter.post("/like", async (req, res) => {
  try {
    const body = req.body;
    const parsed = updateLikesBodySchema.safeParse(req.body);
    if (parsed.error) {
      throw new Error("Invalid body");
    }
    const { media_id, user_id } = parsed.data;
    const result = await update_likes(media_id, user_id);
    res.json({ status: "success" });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", message: (error as Error).message });
  }
});

// (GET /media/likes/:mediaId)
mediaRouter.get("/likes/:mediaId", async (req, res) => {
  const mediaId = parseInt(req.params.mediaId);
  const likes = await get_likes(mediaId);
  res.json({ status: "success", likes });
});

// (GET /media/likes/:mediaId/:userId)
mediaRouter.get("/likes/:mediaId/:userId", async (req, res) => {
  const mediaId = parseInt(req.params.mediaId);
  const userId = parseInt(req.params.userId);
  try {
    const liked = await is_liked(mediaId, userId);
    res.json({ status: "success", liked });
  } catch (error) {
    res.json({ status: "failed", message: (error as Error).message });
  }
});

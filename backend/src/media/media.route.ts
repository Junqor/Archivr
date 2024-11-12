import { Router } from "express";
import { get_likes, is_liked, update_likes } from "./database";

export const mediaRouter = Router();

// (POST /media/like)
mediaRouter.post("/like", async (req, res) => {
  try {
    update_likes(req.body.media_id, req.body.user_id);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failed", message: (error as Error).message });
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
    is_liked(mediaId, userId);
    res.json({ status: "success", liked: true });
  } catch (error) {
    res.json({ status: "failed", message: (error as Error).message });
  }
});

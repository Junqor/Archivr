import { Router } from "express";
import { get_likes, get_media_reviews, is_liked, update_likes, update_review, } from "./database.js";
import { z } from "zod";
export const mediaRouter = Router();
const updateLikesBodySchema = z.object({
    media_id: z.number(),
    user_id: z.number(),
});
// (POST /media/like)
// update likes for a media
mediaRouter.post("/like", async (req, res) => {
    try {
        const parsed = updateLikesBodySchema.safeParse(req.body);
        if (parsed.error) {
            throw new Error("Invalid body");
        }
        const { media_id, user_id } = parsed.data;
        const result = await update_likes(media_id, user_id);
        res.json({ status: "success" });
    }
    catch (error) {
        res
            .status(400)
            .json({ status: "failed", message: error.message });
    }
});
// (GET /media/likes/:mediaId)
// get number of likes for a media
mediaRouter.get("/likes/:mediaId", async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const likes = await get_likes(mediaId);
    res.json({ status: "success", likes });
});
// (GET /media/likes/:mediaId/:userId)
// check if a user has liked a media
mediaRouter.get("/likes/:mediaId/:userId", async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const userId = parseInt(req.params.userId);
    try {
        const liked = await is_liked(mediaId, userId);
        res.json({ status: "success", liked });
    }
    catch (error) {
        res.json({ status: "failed", message: error.message });
    }
});
// (GET /media/reviews/:mediaId)
// Get all reviews for a media
mediaRouter.get("/reviews/:mediaId", async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    try {
        const reviews = await get_media_reviews(mediaId, 10, 0);
        res.json({ status: "success", reviews });
    }
    catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ status: "failed", message: error.message });
    }
});
const reviewBodySchema = z.object({
    media_id: z.number(),
    user_id: z.number(),
    comment: z.string(),
    rating: z.number().default(0),
});
// (POST /media/review)
// Update or add a review for a media
mediaRouter.post("/review", async (req, res) => {
    try {
        const parsed = reviewBodySchema.safeParse(req.body);
        if (parsed.error) {
            throw new Error("Invalid body");
        }
        const { media_id, user_id, comment } = parsed.data;
        const result = await update_review(media_id, user_id, comment);
        res.json({ status: "success" });
    }
    catch (error) {
        res
            .status(400)
            .json({ status: "failed", message: error.message });
    }
});

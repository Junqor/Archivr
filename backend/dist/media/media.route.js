import { Router } from "express";
import { get_likes, get_media_reviews, get_top_rated, get_trending, get_recently_reviewed, get_new_for_you, is_liked, update_likes, update_review, get_user_stats, } from "./media.service.js";
import { z, ZodError } from "zod";
import { authenticateToken, } from "../middleware/authenticateToken.js";
export const mediaRouter = Router();
const updateLikesBodySchema = z.object({
    media_id: z.number(),
});
// (POST /media/like)
// update likes for a media
mediaRouter.post("/like", authenticateToken, async (req, res) => {
    try {
        const token = req.token;
        const { media_id } = updateLikesBodySchema.parse(req.body);
        await update_likes(media_id, token.user.id);
        res.json({ status: "success" });
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err instanceof ZodError ? "Invalid body" : err.message,
        });
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
    comment: z.string(),
    rating: z.number().default(0), //TODO : make dis work
});
// (POST /media/review)
// Update or add a review for a media
mediaRouter.post("/review", authenticateToken, async (req, res) => {
    try {
        const token = req.token;
        const { media_id, comment } = reviewBodySchema.parse(req.body);
        await update_review(media_id, token.user.id, comment);
        res.json({ status: "success" });
    }
    catch (error) {
        res
            .status(400)
            .json({ status: "failed", message: error.message });
    }
});
// (GET /media/top)
// Get the top rated media
mediaRouter.get("/top", async (req, res) => {
    const result = await get_top_rated();
    res.json({ status: "success", media: result.media });
});
// (GET /media/recent-reviews)
// Get the most recent reviews
mediaRouter.get("/recent-reviews", async (req, res) => {
    const result = await get_recently_reviewed();
    res.json({ status: "success", media: result.media });
});
// (GET /media/trending)
// Get the trending media
mediaRouter.get("/trending", async (req, res) => {
    const result = await get_trending();
    res.json({ status: "success", media: result.media });
});
// (GET /media/new-for-you)
// Get new media for the user
mediaRouter.get("/new-for-you", async (req, res) => {
    const userId = parseInt(req.query.user_id);
    const result = await get_new_for_you(userId);
    res.json({ status: "success", media: result.media });
});
// (GET /media/stats/:userId)
// Get stats for a user
mediaRouter.get("/stats/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const result = await get_user_stats(userId);
    res.json({ status: "success", stats: result });
});

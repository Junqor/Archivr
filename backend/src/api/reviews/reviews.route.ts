import { Router, Request } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import {
  addReply,
  checkLikes,
  deleteReview,
  getUserReviewAndRating,
  likeReview,
} from "./reviews.service.js";
import { UnauthorizedError } from "../../utils/error.class.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { z } from "zod";

const reviewsRouter = Router();

// (DELETE /reviews/:reviewId)
reviewsRouter.delete(
  "/:reviewId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { user } = res.locals;
    await deleteReview(parseInt(reviewId), user.id);
    res.json({ status: "success", message: "Review deleted successfully" });
  })
);

// POST /reviews/like/:reviewId
reviewsRouter.post(
  "/like/:reviewId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { user } = res.locals;
    await likeReview(parseInt(reviewId), user.id);
    res.json({ status: "success", message: "" });
  })
);

// GET /reviews/check-likes/:mediaId
reviewsRouter.get(
  "/check-likes/:mediaId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { mediaId } = req.params;
    const { user } = res.locals;
    const likes = await checkLikes(parseInt(mediaId), user.id);
    res.json({ status: "success", likes });
  })
);

// Get the user's rating and review for a show
reviewsRouter.get(
  "/review-rating/:mediaId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const mediaId = parseInt(req.params.mediaId);
    if (isNaN(mediaId)) {
      res.status(400).json({ status: "failed", message: "Invalid mediaId" });
      return;
    }
    const data = await getUserReviewAndRating(user.id, mediaId);
    res.json({ status: "success", data });
  })
);

const replyBodySchema = z.object({
  reviewId: z.coerce.number(),
  text: z.string(),
});

reviewsRouter.post(
  "/reply",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const { reviewId, text } = replyBodySchema.parse(req.body);
    await addReply(text, reviewId, user.id);
    res.json({ status: "success" });
  })
);

export { reviewsRouter };

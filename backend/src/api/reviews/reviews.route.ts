import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import {
  addReply,
  checkLikes,
  deleteReply,
  deleteReview,
  getUserReviewAndRating,
  likeReview,
  updateReview,
  getUserReviews,
} from "./reviews.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { z } from "zod";

const reviewsRouter = Router();

const reviewBodySchema = z.object({
  media_id: z.number(),
  comment: z.string(),
  rating: z.number().default(0), //TODO : make dis work
});

// (POST /media/review)
// Update or add a review for a media
reviewsRouter.post(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const { media_id, comment, rating } = reviewBodySchema.parse(req.body);
    await updateReview(media_id, user.id, comment, rating);
    res.json({ status: "success" });
  })
);

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

reviewsRouter.delete(
  "/reply/:replyId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const replyId = parseInt(req.params.replyId);
    if (isNaN(replyId)) {
      res.status(400).json({ status: "failed", message: "Invalid Reply Id" });
      return;
    }
    await deleteReply(replyId, user.id);
    res.json({ status: "success" });
  })
);

// (GET /reviews/user/:userId?limit=5&offset=0&sort_by=userReviews.createdAt&sort_order=desc&ratingMax=10)
// get reviews for a user
reviewsRouter.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort_by = req.query.sort_by as
      | "userReviews.createdAt"
      | "media.title"
      | "media.rating"
      | "media.release_date"
      | "media.runtime"
      | "ratings.rating"
      | undefined;
    const sort_order = req.query.sort_order as string;
    const ratingMax = parseInt(req.query.ratingMax as string) || 10;

    const reviews = await getUserReviews(
      userId,
      limit,
      offset,
      sort_by,
      sort_order,
      ratingMax
    );
    res.json({ status: "success", data: reviews });
  })
);

export { reviewsRouter };

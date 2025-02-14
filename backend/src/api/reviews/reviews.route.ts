import { Router, Request } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { checkLikes, deleteReview, likeReview } from "./reviews.service.js";
import { UnauthorizedError } from "../../utils/error.class.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

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

export { reviewsRouter };

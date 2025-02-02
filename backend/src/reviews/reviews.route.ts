import { Router, Request } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { deleteReview, UnauthorizedError } from "./reviews.service.js";

const reviewsRouter = Router();

// (DELETE /reviews/:reviewId)
reviewsRouter.delete(
  "/:reviewId",
  authenticateToken,
  async (req: Request<{ reviewId: string }>, res) => {
    const { reviewId } = req.params;
    const { user } = res.locals;
    try {
      const result = await deleteReview(parseInt(reviewId), user.id);

      res.json({ status: "success", message: "Review deleted successfully" });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        res
          .status(500)
          .json({ status: "failed", message: "Something went wrong" });
      }
    }
  }
);

export { reviewsRouter };

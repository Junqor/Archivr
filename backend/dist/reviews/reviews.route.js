import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { checkLikes, deleteReview, likeReview } from "./reviews.service.js";
import { UnauthorizedError } from "../utils/error.class.js";
const reviewsRouter = Router();
// (DELETE /reviews/:reviewId)
reviewsRouter.delete("/:reviewId", authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    const { user } = res.locals;
    try {
        await deleteReview(parseInt(reviewId), user.id);
        res.json({ status: "success", message: "Review deleted successfully" });
    }
    catch (error) {
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ message: "Unauthorized" });
        }
        else {
            res
                .status(500)
                .json({ status: "failed", message: "Something went wrong" });
        }
    }
});
// POST /reviews/like/:reviewId
reviewsRouter.post("/like/:reviewId", authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    const { user } = res.locals;
    try {
        await likeReview(parseInt(reviewId), user.id);
        res.json({ status: "success", message: "" });
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong" });
    }
});
// GET /reviews/check-likes/:mediaId
reviewsRouter.get("/check-likes/:mediaId", authenticateToken, async (req, res) => {
    const { mediaId } = req.params;
    const { user } = res.locals;
    try {
        const likes = await checkLikes(parseInt(mediaId), user.id);
        res.json({ status: "success", likes });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "failed", message: "Something went wrong" });
    }
});
export { reviewsRouter };

import { Router } from "express";

const reviewsRouter = Router();

// (GET /reviews/:mediaId)
reviewsRouter.get("/:mediaId", (req, res) => {
  res.send("Reviews route");
});

export { reviewsRouter };

import { Router } from "express";
import { getWatchProviders } from "./watch.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const watchRouter = Router();

// (GET /watch/:id)
watchRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await getWatchProviders(parseInt(id));
    res.status(200).json({ status: "success", result });
  })
);

export { watchRouter };

import { Router } from "express";
import {
  getMostPopularAnime,
  getMostPopularMovies,
  getMostPopularShows,
} from "./popular.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const popularRouter = Router();

// (GET /api/popular/movies)
// Get the most popular movies
popularRouter.get(
  "/movies",
  asyncHandler(async (req, res) => {
    const result = await getMostPopularMovies();
    res.status(200).json({ status: "success", media: result });
  })
);

popularRouter.get(
  "/shows",
  asyncHandler(async (req, res) => {
    const result = await getMostPopularShows();
    res.status(200).json({ status: "success", media: result });
  })
);

popularRouter.get(
  "/anime",
  asyncHandler(async (req, res) => {
    const result = await getMostPopularAnime();
    res.status(200).json({ status: "success", media: result });
  })
);

export { popularRouter };

import { Router, Request, Response } from "express";
import {
  get_popular_media_genre,
  get_media_genre,
  get_genres,
  getGenresWithTopMedia,
} from "./genre.service.js";
import { z } from "zod";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { cacheRoute } from "../../middleware/cacheRoute.js";

export const genreRouter = Router();

const getPopularMediaGenreBodySchema = z.object({
  genre: z.string(),
});

// (GET /genre/popular?genre=genre)
// get 5 most popular media of a certain genre
genreRouter.get(
  "/popular",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { genre } = getPopularMediaGenreBodySchema.parse(req.query);
    const popularMedia = await get_popular_media_genre(genre);
    if (popularMedia.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "No popular media found for the given genre",
      });
      return;
    }
    res.json({ status: "success", popularMedia });
  })
);

const getMediaGenreBodySchema = z.object({
  genre: z.string(),
  offset: z.coerce.number(),
  sortBy: z.enum(["alphabetical", "release_date", "popularity"]),
  order: z.enum(["asc", "desc"]),
});

// (GET /genre/media?genre=genre&offset=offset&sortBy=sortBy&order=order)
// get 20 medias of a certain genre with offset
genreRouter.get(
  "/media",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { genre, offset, sortBy, order } = getMediaGenreBodySchema.parse(
      req.query
    );
    const media = await get_media_genre(genre, offset, sortBy, order);
    if (media.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "No media found for the given genre",
      });
      return;
    }
    res.json({ status: "success", media });
  })
);

// (GET /genre)
// get a list of distinct genres
genreRouter.get(
  "/",
  cacheRoute(60 * 60 * 24 * 7), // Cache for 7 days
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const genres = await get_genres();
    if (genres.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "No genres found",
      });
      return;
    }
    res.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 7);
    res.json({ status: "success", genres });
  })
);

genreRouter.get(
  "/list",
  asyncHandler(async (req, res) => {
    const data = await getGenresWithTopMedia();
    res.json({ status: "success", data });
  })
);

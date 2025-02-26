import { Router, Request, Response } from "express";
import {
  get_popular_media_genre,
  get_media_genre,
  get_genres,
} from "./genre.service.js";
import { nullable, z, ZodError } from "zod";

export const genreRouter = Router();

const getPopularMediaGenreBodySchema = z.object({
  genre: z.string(),
});

// (GET /genre/popular?genre=genre)
// get 5 most popular media of a certain genre
genreRouter.get(
  "/popular",
  async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message:
          err instanceof ZodError ? "Invalid query" : (err as Error).message,
      });
    }
  }
);

const getMediaGenreBodySchema = z.object({
  genre: z.string(),
  offset: z.coerce.number(),
  sortBy: z.enum(["alphabetical", "release_date", "rating"]),
  order: z.enum(["asc", "desc"]),
});

// (GET /genre/media?genre=genre&offset=offset&sortBy=sortBy&order=order)
// get 20 medias of a certain genre with offset
genreRouter.get(
  "/media",
  async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message:
          err instanceof ZodError ? "Invalid query" : (err as Error).message,
      });
    }
  }
);

// (GET /genre)
// get a list of distinct genres
genreRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await get_genres();
    if (genres.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "No genres found",
      });
      return;
    }
    res.json({ status: "success", genres });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: (err as Error).message,
    });
  }
});

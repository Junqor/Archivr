import { Router } from "express";
import z from "zod";
import { getMediaById, searchMedia, searchUsers } from "./search.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const searchBodySchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(100),
  offset: z.number().min(1),
});

const searchRouter = Router();

// (POST /api/search)
// Search for media by name with specified limit
searchRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = searchBodySchema.safeParse(req.body);
    if (parsed.error) {
      res.status(400).json({ message: "Bad Request", error: parsed.error });
      return;
    }
    const { query, limit, offset } = parsed.data;
    const result = await searchMedia(query, limit, offset);
    res.status(200).json(result);
  })
);

// (POST /api/search/users)
// Search for media by name with specified limit
searchRouter.post(
  "/users",
  asyncHandler(async (req, res) => {
    const parsed = searchBodySchema.safeParse(req.body);
    if (parsed.error) {
      res.status(400).json({ message: "Bad Request", error: parsed.error });
      return;
    }
    const { query, limit, offset } = parsed.data;
    const result = await searchUsers(query, limit, offset);
    res.status(200).json(result);
  })
);

// (GET /api/search/:id)
// Get a single media entry by its id
searchRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await getMediaById(id);
    res.status(200).json(result);
  })
);

export { searchRouter };

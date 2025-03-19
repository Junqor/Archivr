import { Router } from "express";
import z from "zod";
import { getMediaById, searchMedia, searchUsers } from "./search.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { cacheRoute } from "../../middleware/cacheRoute.js";

const searchBodySchema = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(1),
});

const searchRouter = Router();

// (POST /api/search)
// Search for media by name with specified limit
searchRouter.post(
  "/media",
  asyncHandler(async (req, res) => {
    const parsed = searchBodySchema.parse(req.body);
    const { query, limit, offset } = parsed;
    const result = await searchMedia(query, limit, offset);
    res.status(200).json(result);
  })
);

// (GET /api/search/:id)
// Get a single media entry by its id
searchRouter.get(
  "/media/:id",
  cacheRoute(60 * 60 * 24), // Cache for 24 hours
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await getMediaById(id);
    res.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24);
    res.status(200).json(result);
  })
);

const searchUsersQuery = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(1),
  sortBy: z.enum(["username", "followers"]),
  orderBy: z.enum(["asc", "desc"]),
});

// (GET /api/search/users?query=&limit=&offset=&sortBy=username&orderBy=asc)
// Search for users by username/display name
searchRouter.get(
  "/users",
  asyncHandler(async (req, res) => {
    const { query, limit, offset, sortBy, orderBy } = searchUsersQuery.parse(
      req.query
    );
    const result = await searchUsers(query, limit, offset, sortBy, orderBy);
    res.status(200).json(result);
  })
);

export { searchRouter };

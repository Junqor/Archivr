import { Router } from "express";
import z from "zod";
import {
  getMediaById,
  searchMediaFilter,
  searchUsers,
  searchUsersModPortal,
} from "./search.service.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { cacheRoute } from "../../middleware/cacheRoute.js";

const searchBodySchema = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(0),
});

const searchRouter = Router();

const searchBodyFilterSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(0),
  sortBy: z.enum(["alphabetical", "release_date", "popularity"]),
  order: z.enum(["asc", "desc"]),
});

// (GET /api/search/media/filter)
// Search for media by name with specified limit
searchRouter.get(
  "/media/filter",
  asyncHandler(async (req, res) => {
    const parsed = searchBodyFilterSchema.parse(req.query);
    const { q, limit, offset, sortBy, order } = parsed;
    const result = await searchMediaFilter(q, limit, offset, sortBy, order);
    res.status(200).json(result);
  })
);

// (POST /api/search/users)
// Search for media by name with specified limit
searchRouter.post(
  "/users-mod-portal",
  asyncHandler(async (req, res) => {
    const parsed = searchBodySchema.safeParse(req.body);
    if (parsed.error) {
      res.status(400).json({ message: "Bad Request", error: parsed.error });
      return;
    }
    const { query, limit, offset } = parsed.data;
    const result = await searchUsersModPortal(query, limit, offset);
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
    res.status(200).json({ status: "success", media: result });
  })
);

const searchUsersQuery = z.object({
  query: z.string().min(0),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(0),
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

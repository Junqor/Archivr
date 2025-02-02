import z, { ZodError } from "zod";
import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { delete_media, insert_media, update_media } from "./admin.service.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const adminRouter = Router();

const mediaBodySchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  release_date: z.string(),
  age_rating: z.string(),
  thumbnail_url: z.string(),
  rating: z.number(),
  genre: z.string(),
});

// (POST api/admin/insert)
// Insert a new media to the database
adminRouter.post(
  "/insert",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const body = mediaBodySchema.parse(req.body);
      await insert_media(body);
      res.json({ status: "success" });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message:
          error instanceof ZodError ? "Invalid body" : (error as Error).message,
      });
    }
  }
);

const updateMediaBodySchema = z.object({
  id: z.number(),
  newData: mediaBodySchema,
});

// (POST api/admin/update)
// Update a media
adminRouter.post(
  "/update",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const body = updateMediaBodySchema.parse(req.body);
      const result = await update_media(body.id, body.newData);
      res.json({ status: "success", media: result });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message:
          error instanceof ZodError ? "Invalid body" : (error as Error).message,
      });
    }
  }
);

// (DELETE api/admin/delete/:id)
// Delete a media with specified id
adminRouter.delete(
  "/delete/:id",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await delete_media(id);
      res.json({ status: "success", media: result });
    } catch (error) {
      res
        .status(400)
        .json({ status: "failed", message: (error as Error).message });
    }
  }
);

export { adminRouter };

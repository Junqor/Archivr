import { Router } from "express";
import z from "zod";
import { getMediaById, searchMedia } from "./search.service.js";

const searchBodySchema = z.object({
  query: z.string().min(1),
});

const searchRouter = Router();

// (/search)
searchRouter.post("/", async (req, res) => {
  const parsed = searchBodySchema.safeParse(req.body);
  if (parsed.error) {
    res.status(400).json({ message: "Bad Request", error: parsed.error });
    return;
  }
  const { query } = parsed.data;
  const result = await searchMedia(query);
  res.status(200).json(result);
});

searchRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await getMediaById(id);
  res.status(200).json(result);
});

export { searchRouter };

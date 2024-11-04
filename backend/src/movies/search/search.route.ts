import { Router } from "express";
import z from "zod";
import { searchMovies } from "./search.service";

const searchBodySchema = z.object({
  query: z.string().min(1),
});

const searchRouter = Router();

// (/movies/search)
searchRouter.post("/", async (req, res) => {
  try {
    const parsed = searchBodySchema.safeParse(req.body);
    if (parsed.error) {
      res.status(400).json({ message: "Bad Request", error: parsed.error });
      return;
    }
    const { query } = parsed.data;
    const result = await searchMovies(query);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

export { searchRouter };

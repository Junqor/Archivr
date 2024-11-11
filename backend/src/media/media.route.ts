import { Router } from "express";

export const mediaRouter = Router();

// (/media/like)
mediaRouter.post("/like", async (req, res) => {
  res.json({ status: "success" });
});

// (/media/likes)
mediaRouter.post("/likes", async (req, res) => {
  res.json({ status: "success", likes: 3 });
});

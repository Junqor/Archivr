import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, Router } from "express";
import { authRouter } from "../auth/auth.route.js";
import { searchRouter } from "../search/search.route.js";
import { mediaRouter } from "../media/media.route.js";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("public"));
router.use(cors({ origin: "*" }));

router.get("/", (req, res) => {
  res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});

router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/media", mediaRouter);

// Error logging middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status: "failed", message: err.message });
});

export { router };

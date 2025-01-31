import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";
import { authRouter } from "../auth/auth.route.js";
import { searchRouter } from "../search/search.route.js";
import { mediaRouter } from "../media/media.route.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { adminRouter } from "../admin/admin.route.js";
import { emailRouter } from "../recoverEmail/email.route.js";

const router = Router();

// Middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("public"));
router.use(cors({ origin: "*" }));
router.use(errorHandler); // Error logging middleware

// Routes
router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/media", mediaRouter);
router.use("/admin", adminRouter);
router.use("/email", emailRouter)

router.get("/", (req, res) => {
  res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});

export { router };

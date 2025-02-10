import { Router } from "express";
import { authRouter } from "../auth/auth.route.js";
import { searchRouter } from "../search/search.route.js";
import { mediaRouter } from "../media/media.route.js";
import { adminRouter } from "../admin/admin.route.js";
import { userRouter } from "../user/user.route.js";

const router = Router();

// Routes
router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/media", mediaRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.get("/", (req, res) => {
  res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});

export { router };

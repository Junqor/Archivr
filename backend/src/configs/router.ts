import { Router } from "express";
import { authRouter } from "../api/auth/auth.route.js";
import { searchRouter } from "../api/search/search.route.js";
import { mediaRouter } from "../api/media/media.route.js";
import { adminRouter } from "../api/admin/admin.route.js";
import { userRouter } from "../api/user/user.route.js";
import { reviewsRouter } from "../api/reviews/reviews.route.js";
import { watchRouter } from "../api/watch/watch.route.js";
import { genreRouter } from "../api/genre/genre.route.js";

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

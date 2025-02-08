import { Router } from "express";
import { authRouter } from "../auth/auth.route.js";
import { searchRouter } from "../search/search.route.js";
import { mediaRouter } from "../media/media.route.js";
import { adminRouter } from "../admin/admin.route.js";
import { reviewsRouter } from "../reviews/reviews.route.js";
import { watchRouter } from "../watch/watch.route.js";
import { genreRouter } from "../genre/genre.route.js";
const router = Router();
// Routes
router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/media", mediaRouter);
router.use("/admin", adminRouter);
router.use("/reviews", reviewsRouter);
router.use("/watch", watchRouter);
router.use("/genre", genreRouter);
router.get("/", (req, res) => {
    res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});
export { router };

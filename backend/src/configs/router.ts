import { Router } from "express";
import { authRouter } from "../api/auth/auth.route.js";
import { searchRouter } from "../api/search/search.route.js";
import { mediaRouter } from "../api/media/media.route.js";
import { adminRouter } from "../api/admin/admin.route.js";
import { userRouter } from "../api/user/user.route.js";
import { reviewsRouter } from "../api/reviews/reviews.route.js";
import { watchRouter } from "../api/watch/watch.route.js";
import { genreRouter } from "../api/genre/genre.route.js";
import { popularRouter } from "../api/popular/popular.route.js";
import { emailRouter } from "../api/email/email.route.js";
import { activityRouter } from "../api/activity/activity.route.js";
import { moderationRouter } from "../api/moderation/moderation.route.js";
import { likesRouter } from "../api/likes/likes.route.js";

const router = Router();

// Routes
router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/media", mediaRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/reviews", reviewsRouter);
router.use("/watch", watchRouter);
router.use("/genre", genreRouter);
router.use("/popular", popularRouter);
router.use("/email", emailRouter);
router.use("/activity", activityRouter);
router.use("/moderation", moderationRouter);
router.use("/likes", likesRouter);

router.get("/", (req, res) => {
  res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});

export { router };

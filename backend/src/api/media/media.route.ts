import { Router } from "express";
import {
  get_likes,
  get_media_reviews,
  get_media_rating,
  get_recently_reviewed,
  get_new_for_you,
  is_liked,
  update_likes,
  get_user_stats,
  getMostPopular,
  getMediaBackground,
  getMediaTrailer,
  get_recommended_for_you,
  get_similar_to_watched,
  getTrending,
  getTopRatedPicks,
  getTrendingPaginated,
  getRandomMedia,
} from "./media.service.js";
import { z } from "zod";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export const mediaRouter = Router();

const updateLikesBodySchema = z.object({
  media_id: z.number(),
});

// (POST /media/like)
// update likes for a media
mediaRouter.post(
  "/like",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user } = res.locals;
    const { media_id } = updateLikesBodySchema.parse(req.body);

    await update_likes(media_id, user.id);
    res.json({ status: "success" });
  })
);

// (GET /media/likes/:mediaId)
// get number of likes for a media
mediaRouter.get(
  "/likes/:mediaId",
  asyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const likes = await get_likes(mediaId);
    res.json({ status: "success", likes });
  })
);

// (GET /media/likes/:mediaId/:userId)
// check if a user has liked a media
mediaRouter.get(
  "/likes/:mediaId/:userId",
  asyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const userId = parseInt(req.params.userId);
    const liked = await is_liked(mediaId, userId);
    res.json({ status: "success", liked });
  })
);

// (GET /media/reviews/:mediaId)
// Get all reviews for a media
mediaRouter.get(
  "/reviews/:mediaId",
  asyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const reviews = await get_media_reviews(mediaId, 10, 0);
    res.json({ status: "success", reviews });
  })
);

// (GET /media/user-rating/:mediaId)
// Get the user rating (total average) for a media
mediaRouter.get(
  "/user-rating/:mediaId",
  asyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const rating = await get_media_rating(mediaId);
    res.json({ status: "success", rating: rating });
  })
);

// (GET /media/random)
mediaRouter.get(
  "/random",
  asyncHandler(async (req, res) => {
    const media = await getRandomMedia();
    res.json({ status: "success", media });
  })
);

// (GET /media/popular)
// Get the most popular media as defined by the data retrieved from the api
mediaRouter.get(
  "/popular",
  asyncHandler(async (req, res) => {
    const media = await getMostPopular();
    res.json({ status: "success", media: media });
  })
);

// (GET /media/recent-reviews)
// Get the most recent reviews
mediaRouter.get(
  "/recent-reviews",
  asyncHandler(async (req, res) => {
    const media = await get_recently_reviewed();
    res.json({ status: "success", media: media });
  })
);

// (GET /media/top-rated-picks)
// Get the trending media
mediaRouter.get(
  "/top-rated-picks",
  asyncHandler(async (req, res) => {
    const { media } = await getTopRatedPicks();
    res.json({ status: "success", media: media });
  })
);

// (GET /media/trending)
// Get the trending media
mediaRouter.get(
  "/trending",
  asyncHandler(async (req, res) => {
    const movies = await getTrending("movie");
    const shows = await getTrending("tv");
    res.json({ status: "success", media: { movies, shows } });
  })
);

const trendingSearchParams = z.object({
  type: z.enum(["movie", "tv"]),
  page: z.coerce.number(),
});
// (GET /media/trending)
// Get the trending media with pagination
mediaRouter.get(
  "/trending-paginated",
  asyncHandler(async (req, res) => {
    const { type, page } = trendingSearchParams.parse(req.query);
    const media = await getTrendingPaginated(type, page);
    res.json({ status: "success", media: media });
  })
);

// (GET /media/new-for-you)
// Get new media for the user
mediaRouter.get(
  "/new-for-you",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.query.user_id as string);
    const media = await get_new_for_you(userId);
    res.json({ status: "success", media: media });
  })
);

// (GET /media/stats/:userId)
// Get stats for a user
mediaRouter.get(
  "/stats/:userId",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const result = await get_user_stats(userId);
    res.json({ status: "success", stats: result });
  })
);

// (GET /media/background/:id)
// get media background by id
mediaRouter.get(
  "/background/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await getMediaBackground(parseInt(id));
    res.status(200).json({ status: "success", result });
  })
);

// (GET /media/trailer/:id)
// get media trailer by id
mediaRouter.get(
  "/trailer/:id",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getMediaTrailer(parseInt(id));
      res.status(200).json({ status: "success", result });
    } catch (error) {
      res
        .status(500)
        .json({ status: "failed", message: "Something went wrong" });
    }
  })
);

// (GET /media/recommended-for-you)
// get recommended media for the user
mediaRouter.get(
  "/recommended-for-you",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.query.user_id as string);
    const result = await get_recommended_for_you(userId);
    res.json({ status: "success", media: result });
  })
);

// (GET /media/similar-to-watched)
// get similar media to the watched media
mediaRouter.get(
  "/similar-to-watched",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.query.user_id as string);
    const result = await get_similar_to_watched(userId);
    res.json({
      status: "success",
      media: result.media,
      basedOn: result.basedOn,
    });
  })
);

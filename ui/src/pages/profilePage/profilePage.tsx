// profilePage.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  getProfilePageData,
  getProfileTabData,
  getUserFollows,
  getFavorites,
} from "@/api/user";
import { getUserReviews } from "@/api/reviews";
import { getUserLikes } from "@/api/likes";
import { getUserTopMedia, getUserActivity } from "@/api/activity";
import { getGenres } from "@/api/genre";
import {
  TabsContainer,
  TabTrigger,
  TabList,
  TabContent,
} from "@/components/ui/tabs";
import { getMediaBackground } from "@/api/media";
import { UserAvatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { LoadingScreen } from "../loadingScreen";
import ProfileHero from "./components/profileHero";
import {
  FavoriteRounded,
  SwapVertRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
} from "@mui/icons-material";
import { StarBadgeSVG } from "@/components/svg/starBadgeSVG";
import { Vibrant } from "node-vibrant/browser";
import ProfileStats from "./components/profileStats";
import MediaGrid from "./components/media4Grid";
import { ratingToStars, ratingToTextStars } from "@/utils/ratingToStars";
import ReviewList from "./components/reviewList";
import MiniActivity from "./components/miniActivity";

type Palette = Awaited<ReturnType<typeof getColorPalette>>;

interface TopMediaProps {
  pallette: {
    Vibrant: string;
    DarkVibrant: string;
    LightVibrant: string;
    Muted: string;
    DarkMuted: string;
    LightMuted: string;
  };
  id: number;
  title: string;
  thumbnail_url: string;
  rating: number;
  user_rating: number;
  ratedAt: string;
}

interface followProps {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: "admin" | "user" | undefined;
  createdAt: string;
}

interface likedMediaProps {
  id: number;
  title: string;
  thumbnail_url: string;
  rating: number;
  like_count: number;
  avg_rating: number;
  user_rating: number;
  is_liked: number;
}

{
  /*
interface FavoriteProps {
  id: number;
  media_id: number;
  title: string;
  thumbnail_url: string;
  added_at: string;
}
*/
}

{
  /*
interface ProfileTabProps {
  likes: [
    {
      id: number;
      title: string;
      thumbnail_url: string;
      rating: number;
      like_count: number;
      average_rating: number;
      user_rating: number;
      is_liked: number;
    },
  ];
  recentReviews: [
    {
      review: {
        id: number;
        comment: string;
        review_likes: number;
        createdAt: string;
      };
      media: {
        id: number;
        title: string;
        release_date: string;
        thumbnail_url: string;
        rating: number;
        avg_rating: number;
        like_count: number;
      };
      user_rating: number;
      is_liked: number;
    },
  ];
  popularReviews: [
    {
      review: {
        id: number;
        comment: string;
        review_likes: number;
        createdAt: string;
      };
      media: {
        id: number;
        title: string;
        release_date: string;
        thumbnail_url: string;
        rating: number;
        avg_rating: number;
        like_count: number;
      };
      user_rating: number;
      is_liked: number;
    },
  ];
  recentActivity: [
    {
      activity: {
        id: number;
        userId: number;
        activityType: string;
        targetId: number;
        relatedId: number;
        content: string;
        createdAt: string;
      };
      media?: {
        title: string;
        thumbnail_url: string;
        rating: number;
        release_date: string;
        like_count: number;
        is_liked: number;
      };
      user: {
        username: string;
        avatar_url: string;
        role: string;
        display_name: string;
        rating: number;
      };
      review?: {
        created_at: string;
        review_likes: number;
      };
      followee?: {
        username: string;
        display_name: string;
        avatar_url: string;
        role: string;
      };
      reply?: {
        user_id: number;
        username: string;
        avatar_url: string;
        role: string;
        display_name: string;
        rating: number;
      };
    },
  ];
}
*/
}

{
  /*
interface reviewProps {
  review: {
    id: number;
    comment: string;
    review_likes: number;
    createdAt: string;
  };
  media: {
    id: number;
    title: string;
    release_date: string;
    thumbnail_url: string;
    rating: number;
    avg_rating: number;
    like_count: number;
  };
  user_rating: number;
  is_liked: number;
}
*/
}

function useMediaLikesState() {
  const [rating, setRating] = useState<number | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    | "When Liked"
    | "Media Title"
    | "Media Rating"
    | "Media Release Date"
    | "Media Runtime"
    | "Rating"
  >("When Liked");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(0);

  return {
    rating,
    setRating,
    genre,
    setGenre,
    sortBy,
    setSortBy,
    order,
    setOrder,
    page,
    setPage,
  };
}

function useMediaReviewsState() {
  const [rating, setRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    | "when-reviewed"
    | "title"
    | "rating"
    | "release-date"
    | "runtime"
    | "user-rating"
  >("when-reviewed");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(0);

  return {
    rating,
    setRating,
    sortBy,
    setSortBy,
    order,
    setOrder,
    page,
    setPage,
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { username } = useParams();
  const mediaLikesParams = useMediaLikesState();
  const mediaReviewsParams = useMediaReviewsState();
  const [background, setBackground] = useState<string>("");
  const [tab, setTab] = useState("profile");

  // Fetch profile data
  const { data: profilePage, isLoading: isProfilePageLoading } = useQuery({
    queryKey: ["profilePage", username],
    queryFn: () => getProfilePageData(username || ""),
    enabled: !!username,
  });

  // Fetch Favorite Media
  const { data: favorites } = useQuery({
    queryKey: ["favorites", username],
    queryFn: () => getFavorites(username || ""),
    enabled: !!username,
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchMediaBackground = async () => {
      if (favorites && favorites.length > 0) {
        try {
          const background = await getMediaBackground(favorites[0].media_id);
          setBackground(background);
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Failed to fetch background:", error);
          }
        }
      }
    };

    fetchMediaBackground();

    return () => controller.abort(); // Cleanup on unmount
  }, [favorites]);

  // When tab = "profile", fetch profile tab data
  const { data: profileTab } = useQuery({
    queryKey: ["profileTab", username],
    queryFn: () => getProfileTabData(username || ""),
    enabled: tab === "profile" && !!username,
  });

  // When tab = "profile" or tab = "activity", fetch user follows
  const { data: userFollows } = useQuery({
    queryKey: ["userFollows", username],
    queryFn: () => getUserFollows(username || "", "following"),
    enabled: tab === "profile" || (tab === "activity" && !!username),
  });

  const REVIEW_PAGE_SIZE = 15;

  const {
    data: mediaReviews,
    isFetching: isReviewsFetching,
    isPending: isReviewsPending,
    error: reviewsError,
  } = useQuery({
    queryKey: [
      "mediaReviews",
      username,
      mediaReviewsParams.rating,
      mediaReviewsParams.sortBy,
      mediaReviewsParams.order,
      mediaReviewsParams.page,
    ],
    queryFn: () =>
      getUserReviews(
        username || "",
        REVIEW_PAGE_SIZE,
        (mediaReviewsParams.page as number) * REVIEW_PAGE_SIZE,
        mediaReviewsParams.sortBy as string,
        mediaReviewsParams.order as string,
        mediaReviewsParams.rating as number,
      ),
    enabled: tab === "reviews" && !!username,
  });

  const handleChangeReviewRating = (newRating: number) => {
    mediaReviewsParams.setRating(newRating);
  };

  const handleChangeReviewSortBy = (
    newSortBy:
      | "when-reviewed"
      | "title"
      | "rating"
      | "release-date"
      | "runtime"
      | "user-rating",
  ) => {
    mediaReviewsParams.setSortBy(newSortBy);
  };

  const handleChangeReviewOrder = (newOrder: "asc" | "desc") => {
    mediaReviewsParams.setOrder(newOrder);
  };

  const handleChangeReviewPage = (newPage: number) => {
    mediaReviewsParams.setPage(newPage);
  };

  const {
    data: userTopMedia,
    isFetching: isTopMediaFetching,
    isPending: isTopMediaPending,
    error: topMediaError,
  } = useQuery({
    queryKey: ["userTopMedia", username],
    queryFn: () => getUserTopMedia(username || ""),
    enabled: tab === "reviews" && !!username,
  });

  const [topUserMedia, setTopUserMedia] = useState<
    (TopMediaProps & { pallette: Palette })[] | null
  >(null);

  useEffect(() => {
    if (!userTopMedia) return;
    const getColors = async () => {
      const media = await Promise.all(
        userTopMedia.map(async (m: TopMediaProps) => {
          const pallette = await getColorPalette(m.thumbnail_url);
          return { ...m, pallette };
        }),
      );
      setTopUserMedia(media);
    };
    getColors();
  }, [userTopMedia]);

  const LIKES_PAGE_SIZE = 30;

  const {
    data: mediaLikes,
    isFetching: isLikesFetching,
    isPending: isLikesPending,
    error: likesError,
  } = useQuery({
    queryKey: [
      "mediaLikes",
      username,
      mediaLikesParams.rating,
      mediaLikesParams.genre,
      mediaLikesParams.sortBy,
      mediaLikesParams.order,
      mediaLikesParams.page,
    ],
    queryFn: () =>
      getUserLikes(
        username || "",
        LIKES_PAGE_SIZE,
        (mediaLikesParams.page as number) * LIKES_PAGE_SIZE,
        mediaLikesParams.sortBy as string,
        mediaLikesParams.order as string,
        mediaLikesParams.rating as number,
        mediaLikesParams.genre as string,
      ),
    enabled: tab === "likes" && !!username,
  });

  const handleChangeLikeRating = (newRating: number) => {
    mediaLikesParams.setRating(newRating);
  };

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    enabled: tab === "likes",
  });

  const handleChangeLikeGenre = (newGenre: string) => {
    mediaLikesParams.setGenre(newGenre);
  };

  const handleChangeLikeSortBy = (
    newSortBy:
      | "When Liked"
      | "Media Title"
      | "Media Rating"
      | "Media Release Date"
      | "Media Runtime"
      | "Rating",
  ) => {
    mediaLikesParams.setSortBy(newSortBy);
  };

  const handleChangeLikeOrder = (newOrder: "asc" | "desc") => {
    mediaLikesParams.setOrder(newOrder);
  };

  const handleChangeLikePage = (newPage: number) => {
    mediaLikesParams.setPage(newPage);
  };

  if (!username) {
    return <Navigate to="/404" />;
  }

  if (isProfilePageLoading) {
    return <LoadingScreen />;
  }

  if (!profilePage) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <ProfileHero
        user={user}
        profilePage={profilePage}
        background={background}
      />
      <section className="flex flex-col-reverse items-end justify-between gap-2 self-stretch border-b border-muted/75 pb-1 sm:flex-row sm:items-center sm:px-10">
        <TabsContainer value={tab} onValueChange={setTab}>
          <TabList>
            <TabTrigger
              value="profile"
              className="w-full py-4 sm:w-auto sm:py-0"
            >
              Profile
            </TabTrigger>
            <Separator orientation="vertical" className="h-auto" decorative />
            <TabTrigger
              value="activity"
              className="w-full py-4 sm:w-auto sm:py-0"
            >
              Activity
            </TabTrigger>
            <Separator orientation="vertical" className="h-auto" decorative />
            <TabTrigger
              value="reviews"
              className="w-full py-4 sm:w-auto sm:py-0"
            >
              Reviews
            </TabTrigger>
            <Separator orientation="vertical" className="h-auto" decorative />
            <TabTrigger value="likes" className="w-full py-4 sm:w-auto sm:py-0">
              Likes
            </TabTrigger>
          </TabList>
        </TabsContainer>
        <ProfileStats {...profilePage} />
      </section>
      <section className="flex w-full items-start gap-5">
        <TabsContainer value={tab} onValueChange={setTab}>
          <TabContent value="profile" className="flex w-full items-start gap-5">
            <div className="flex w-full flex-shrink-0 flex-col items-start gap-5 sm:w-3/4">
              {favorites && favorites.length > 0 && (
                <MediaGrid title="Favorite Media" items={favorites} />
              )}
              {profileTab && profileTab.likes.length > 0 && (
                <MediaGrid
                  title="Likes"
                  items={profileTab.likes}
                  onViewAll={() => setTab("likes")}
                />
              )}
              {profileTab && profileTab.recentReviews.length > 0 && (
                <div className="flex w-full flex-col items-start gap-3 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex w-full items-start justify-between gap-2 self-stretch">
                      <h4 className="text-muted">Recent Reviews</h4>
                      <button
                        className="text-muted hover:underline"
                        onClick={() => setTab("reviews")}
                      >
                        <h4>More</h4>
                      </button>
                    </div>
                    <Separator orientation="horizontal" />
                  </div>
                  <ReviewList reviews={profileTab.recentReviews} />
                </div>
              )}
              {profileTab && profileTab.popularReviews && (
                <div className="flex w-full flex-col items-start gap-3 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex w-full items-start justify-between gap-2 self-stretch">
                      <h4 className="text-muted">Popular Reviews</h4>
                      <button
                        className="text-muted hover:underline"
                        onClick={() => setTab("reviews")}
                      >
                        <h4>More</h4>
                      </button>
                    </div>
                    <Separator orientation="horizontal" />
                  </div>
                  <ReviewList reviews={profileTab.popularReviews} />
                </div>
              )}
            </div>
            <div className="hidden w-1/4 flex-[1_0_0] flex-col items-start gap-3 sm:flex">
              {profileTab && profileTab.recentActivity && (
                <div className="flex w-full flex-col items-start gap-3 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex w-full items-start justify-between gap-2 self-stretch">
                      <h4 className="text-muted">Activity</h4>
                      <button
                        className="text-muted hover:underline"
                        onClick={() => setTab("activity")}
                      >
                        <h4>More</h4>
                      </button>
                    </div>
                    <Separator orientation="horizontal" />
                  </div>
                  <MiniActivity activity={profileTab.recentActivity} />
                </div>
              )}
              {userFollows && userFollows.length > 0 && (
                <div className="flex w-full flex-col items-start gap-3 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex w-full items-start justify-between gap-2 self-stretch">
                      <h4 className="text-muted">Following</h4>
                      <button
                        className="text-muted hover:underline"
                        onClick={() => setTab("activity")}
                      >
                        <h4>More</h4>
                      </button>
                    </div>
                    <Separator orientation="horizontal" />
                  </div>
                  <div className="flex w-full flex-wrap content-start items-start gap-2 self-stretch">
                    {userFollows.map((follow: followProps) => (
                      <Link
                        to={`/profile/${follow.username}`}
                        key={follow.id}
                        className="flex items-center gap-2"
                        title={follow.displayName || follow.username}
                      >
                        <UserAvatar
                          user={{
                            username: follow.username,
                            avatar_url: follow.avatarUrl,
                            role: follow.role,
                          }}
                          className="size-[2.9rem] border border-muted"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabContent>
          <TabContent
            value="activity"
            className="flex w-full items-start gap-5"
          >
            <div className="flex w-3/4 flex-shrink-0 flex-col items-start gap-5"></div>
            <div className="flex w-1/4 flex-[1_0_0] flex-col items-start gap-3"></div>
          </TabContent>
          <TabContent value="reviews" className="flex w-full items-start gap-5">
            <div className="flex w-full flex-col items-start gap-5 sm:w-3/4">
              <section className="flex w-full items-center justify-end self-stretch">
                <form className="flex flex-col items-center gap-5 sm:flex-row">
                  <fieldset className="flex items-center gap-3">
                    <h4>
                      <label htmlFor="reviewRating">Rating</label>
                    </h4>
                    <select
                      name="reviewRating"
                      id="reviewRating"
                      value={mediaReviewsParams.rating ?? ""}
                      onChange={(e) =>
                        handleChangeReviewRating(e.target.value as any)
                      }
                      className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
                    >
                      <option value="">All</option>
                      <option value="10">{ratingToTextStars(10)}</option>
                      <option value="8">{ratingToTextStars(8)}</option>
                      <option value="6">{ratingToTextStars(6)}</option>
                      <option value="4">{ratingToTextStars(4)}</option>
                      <option value="2">{ratingToTextStars(2)}</option>
                    </select>
                  </fieldset>
                  <fieldset className="flex items-center gap-3">
                    <h4>
                      <label htmlFor="reviewSort">Sort by</label>
                    </h4>
                    <select
                      name="reviewSort"
                      id="reviewSort"
                      value={mediaReviewsParams.sortBy}
                      onChange={(e) =>
                        handleChangeReviewSortBy(e.target.value as any)
                      }
                      className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
                    >
                      <option value="when-reviewed">When Reviewed</option>
                      <option value="title">Media Title</option>
                      <option value="rating">Media Rating</option>
                      <option value="release-date">Release Date</option>
                      <option value="runtime">Runtime</option>
                      <option value="user-rating">
                        {profilePage.displayName || profilePage.username}'s
                        Rating
                      </option>
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        handleChangeReviewOrder(
                          mediaReviewsParams.order === "asc" ? "desc" : "asc",
                        )
                      }
                      className={`flex items-center justify-center p-1 transition-transform duration-300 ${
                        mediaReviewsParams.order === "asc"
                          ? "rotate-0"
                          : "rotate-180"
                      }`}
                    >
                      <SwapVertRounded />
                    </button>
                  </fieldset>
                </form>
              </section>
              <section className="flex w-full flex-col items-start">
                {isReviewsFetching || isReviewsPending ? (
                  [...Array(15)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="flex w-full items-start gap-3"
                    />
                  ))
                ) : (
                  <ReviewList reviews={mediaReviews} />
                )}
              </section>
              <section className="flex w-full justify-center gap-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleChangeReviewPage(
                        Math.max(0, mediaReviewsParams.page - 1),
                      )
                    }
                    disabled={mediaReviewsParams.page === 0}
                    className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${mediaReviewsParams.page === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
                  >
                    <ChevronLeftRounded />
                  </button>
                  <h3
                    className={`${mediaReviewsParams.page === 0 ? "text-muted" : "text-white"}`}
                  >
                    Previous
                  </h3>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-auto"
                  decorative
                />
                <div className="flex items-center gap-3">
                  <h3
                    className={`${
                      !mediaReviews || mediaReviews.length < REVIEW_PAGE_SIZE
                        ? "text-muted"
                        : "text-white"
                    }`}
                  >
                    Next
                  </h3>
                  <button
                    onClick={() =>
                      handleChangeReviewPage(mediaReviewsParams.page + 1)
                    }
                    disabled={
                      !mediaReviews || mediaReviews.length < REVIEW_PAGE_SIZE
                    }
                    className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${
                      !mediaReviews || mediaReviews.length < REVIEW_PAGE_SIZE
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-white hover:text-black"
                    }`}
                  >
                    <ChevronRightRounded />
                  </button>
                </div>
              </section>
            </div>
            <div className="hidden flex-[1_0_0] flex-col items-start gap-3 sm:flex sm:w-1/4">
              {isTopMediaFetching || isTopMediaPending || !topUserMedia ? (
                <div className="flex flex-row items-center gap-x-5 overflow-auto px-10 py-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-hidden md:p-0">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="aspect-2/3 h-40" />
                  ))}
                </div>
              ) : (
                <div className="grid w-full grid-cols-2 gap-3">
                  {topUserMedia.map((media: TopMediaProps, index: number) => (
                    <div
                      key={media.id}
                      className="relative flex aspect-2/3 w-full items-end justify-end"
                    >
                      <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-9 items-center justify-center font-extrabold leading-[2.25rem] md:size-16 md:leading-[2.75rem]">
                        <StarBadgeSVG
                          className="absolute z-10 size-14"
                          fill={media.pallette.DarkVibrant}
                        />
                        <h4 className="absolute z-20 font-bold">
                          #{index + 1}
                        </h4>
                      </div>
                      <ThumbnailPreview
                        key={media.id}
                        media={{
                          id: media.id,
                          title: media.title,
                          thumbnail_url: media.thumbnail_url,
                          rating: media.rating,
                        }}
                        className="w-10/12"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabContent>
          <TabContent
            value="likes"
            className="flex w-full flex-col items-start gap-5"
          >
            <section className="flex w-full items-center justify-end self-stretch sm:justify-between">
              <form className="flex flex-col items-center gap-5 sm:flex-row">
                <fieldset className="flex items-center gap-3">
                  <h4>
                    <label htmlFor="likeRating">Rating</label>
                  </h4>
                  <select
                    name="likeRating"
                    id="likeRating"
                    value={mediaLikesParams.rating ?? ""}
                    onChange={(e) =>
                      handleChangeLikeRating(e.target.value as any)
                    }
                    className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
                  >
                    <option value="">All</option>
                    <option value="10">{ratingToTextStars(10)}</option>
                    <option value="8">{ratingToTextStars(8)}</option>
                    <option value="6">{ratingToTextStars(6)}</option>
                    <option value="4">{ratingToTextStars(4)}</option>
                    <option value="2">{ratingToTextStars(2)}</option>
                  </select>
                </fieldset>
                <fieldset className="flex items-center gap-3">
                  <h4>
                    <label htmlFor="likeGenre">Genre</label>
                  </h4>
                  <select
                    name="likeGenre"
                    id="likeGenre"
                    value={mediaLikesParams.genre}
                    onChange={(e) =>
                      handleChangeLikeGenre(e.target.value as any)
                    }
                    className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
                  >
                    <option value="">All</option>
                    {genres?.map((genre) => (
                      <option key={genre.genre} value={genre.genre}>
                        {genre.genre}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset className="flex items-center gap-3">
                  <h4>
                    <label htmlFor="likeSort">Sort by</label>
                  </h4>
                  <select
                    name="likeSort"
                    id="likeSort"
                    value={mediaLikesParams.sortBy}
                    onChange={(e) =>
                      handleChangeLikeSortBy(e.target.value as any)
                    }
                    className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
                  >
                    <option value="When Liked">When Liked</option>
                    <option value="Media Title">Media Title</option>
                    <option value="Media Rating">Media Rating</option>
                    <option value="Media Release Date">Release Date</option>
                    <option value="Media Runtime">Runtime</option>
                    <option value="Rating">
                      {profilePage.displayName || profilePage.username}'s Rating
                    </option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleChangeLikeOrder(
                        mediaLikesParams.order === "asc" ? "desc" : "asc",
                      )
                    }
                    className={`flex items-center justify-center p-1 transition-transform duration-300 ${
                      mediaLikesParams.order === "asc"
                        ? "rotate-0"
                        : "rotate-180"
                    }`}
                  >
                    <SwapVertRounded />
                  </button>
                </fieldset>
              </form>
            </section>
            <section className="grid w-full grid-cols-3 gap-4 md:grid-cols-5">
              {isLikesFetching || isLikesPending
                ? [...Array(30)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-[2/3] h-full w-full rounded-sm outline outline-1 outline-white/10"
                    />
                  ))
                : mediaLikes.map((likedMedia: likedMediaProps) => (
                    <div
                      className="flex aspect-[2/3] flex-[1_0_0] flex-col items-start gap-1"
                      key={likedMedia.id}
                    >
                      <ThumbnailPreview
                        key={likedMedia.id}
                        media={likedMedia}
                        className="w-full"
                      />
                      <div className="flex items-center gap-1 text-xl sm:text-2xl">
                        {likedMedia.user_rating !== null && (
                          <div className="flex items-center">
                            {ratingToStars(likedMedia.user_rating)}
                          </div>
                        )}
                        <FavoriteRounded
                          fontSize="inherit"
                          className={`text-muted ${likedMedia.is_liked === 1 ? "" : "invisible"} scale-75`}
                        />
                      </div>
                    </div>
                  ))}
            </section>
            <section className="flex w-full justify-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleChangeLikePage(Math.max(0, mediaLikesParams.page - 1))
                  }
                  disabled={mediaLikesParams.page === 0}
                  className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${mediaLikesParams.page === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
                >
                  <ChevronLeftRounded />
                </button>
                <h3
                  className={`${mediaLikesParams.page === 0 ? "text-muted" : "text-white"}`}
                >
                  Previous
                </h3>
              </div>
              <Separator orientation="vertical" className="h-auto" decorative />
              <div className="flex items-center gap-3">
                <h3
                  className={`${
                    !mediaLikes || mediaLikes.length < LIKES_PAGE_SIZE
                      ? "text-muted"
                      : "text-white"
                  }`}
                >
                  Next
                </h3>
                <button
                  onClick={() =>
                    handleChangeLikePage(mediaLikesParams.page + 1)
                  }
                  disabled={!mediaLikes || mediaLikes.length < LIKES_PAGE_SIZE} // Disable if no more media
                  className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${!mediaLikes || mediaLikes.length < LIKES_PAGE_SIZE ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
                >
                  <ChevronRightRounded />
                </button>
              </div>
            </section>
          </TabContent>
        </TabsContainer>
      </section>
    </>
  );
}

const getColorPalette = async (url: string | null) => {
  const c = "#5616EC";
  const defaultPalette = {
    Vibrant: c,
    DarkVibrant: c,
    LightVibrant: c,
    Muted: c,
    DarkMuted: c,
    LightMuted: c,
  };
  if (!url) return defaultPalette;

  const palette = await Vibrant.from(url).getPalette();

  if (!palette) return defaultPalette;

  const keys = Object.keys(defaultPalette) as Array<
    keyof typeof defaultPalette
  >;

  // Build the result by mapping keys to their respective hex value or defaultColor
  return keys.reduce(
    (acc, key) => {
      acc[key] = palette[key]?.hex ?? c;
      return acc;
    },
    {} as typeof defaultPalette,
  );
};

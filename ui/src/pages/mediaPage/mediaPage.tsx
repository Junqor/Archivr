import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessagesSquare, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Navigate, Link } from "react-router-dom";
import { TMedia } from "@/types/media";
import { useMedia } from "@/hooks/useMedia";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { getRecommendations, searchMedia } from "@/api/media";
import empty from "@/assets/empty.png";
import { formatDateYear } from "@/utils/formatDate";
import { useAuth } from "@/context/auth";
import { formatInteger } from "@/utils/formatInteger";
import { ReviewSection } from "./components/reviewSection";
import { cn } from "@/lib/utils";
import {
  SignalCellularAlt,
  StarRounded,
  CalendarMonthRounded,
  AccessTimeRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import {
  checkLikes,
  getUserReviewAndRating,
  TReviewResponse,
} from "@/api/reviews";
import { getWatchProviders } from "@/api/watch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRatings } from "../../components/starRatings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadCN";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MediaCarousel from "@/components/MediaCarousel";
import { Separator } from "@/components/ui/separator";

export function MediaPage() {
  const { id } = useParams();
  const match = id?.match(/^\d+$/); // Check that the id is an integer
  if (!match) {
    return <Navigate to="/404" />;
  }
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [userWasSilly, setUserWasSilly] = useState(false);
  const [region, setRegion] = useState("US");
  const [tab, setTab] = useState<"reviews" | "recommendations">("reviews");

  function handleAddReview() {
    if (rating === null) {
      setUserWasSilly(true);
    } else {
      updateReview({ comment: review, rating: rating * 2 });
    }
  }

  function handleType(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserWasSilly(false);
    setReview(e.target.value);
  }

  const {
    isLiked,
    updateLikes,
    numLikes,
    reviewData,
    updateReview,
    userRating,
  } = useMedia(id as string, user ? `${user.id}` : "");

  const { data: reviewsLikedByUser } = useQuery({
    queryKey: ["media", id, "reviews/check-likes"],
    queryFn: () => checkLikes(parseInt(id as string)),
    enabled: !!user,
  });

  const { isPending, error, data } = useQuery<TMedia>({
    queryKey: ["media", id],
    queryFn: () => searchMedia({ id } as { id: string }),
  });

  const { data: watchProviders } = useQuery({
    queryKey: ["media", id, "watch-providers"],
    queryFn: () => getWatchProviders(parseInt(id as string)),
  });

  const { data: ratingAndReview } = useQuery({
    queryKey: ["media", id, "ratingAndReview"],
    queryFn: () => getUserReviewAndRating(parseInt(id as string)),
    enabled: !!user,
  });

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    isPending: isRecommendationsPending,
    isError: isRecommendationsError,
  } = useQuery({
    queryKey: ["media", id, "recommendations"],
    queryFn: () => getRecommendations(parseInt(id as string)),
    enabled: tab === "recommendations",
  });

  // Show the users current rating and review
  useEffect(() => {
    if (!ratingAndReview) return;
    if (ratingAndReview.rating) {
      setRating(ratingAndReview.rating / 2);
    }
    if (ratingAndReview.review) {
      setReview(ratingAndReview.review);
    }
  }, [ratingAndReview]);

  const handleLike = () => {
    updateLikes();
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Get the watch provider data for the selected region
  const regionData = watchProviders
    ? Object.values(watchProviders).find(
        (watchProvider) => watchProvider.region === region,
      )
    : null;

  return (
    <div className="flex h-fit w-full flex-col items-start justify-center gap-4 bg-black px-4 py-8 text-gray-100 sm:px-6 lg:px-8">
      <section className="relative flex h-auto w-full flex-row gap-x-5 sm:h-96">
        {/* blurred background image */}
        <div
          className="absolute z-0 h-5/6 w-full self-center justify-self-center overflow-hidden opacity-30"
          style={{
            background: `url(${data.thumbnail_url}) lightgray 50% / cover no-repeat`,
            filter: "blur(15px)",
          }}
        />
        {/* Poster Image */}
        <div className="relative z-10 order-2 w-1/3 sm:order-1 sm:w-1/4">
          <img
            src={data.thumbnail_url}
            alt="Poster Thumbnail"
            className="max-h-full max-w-full rounded-lg object-scale-down shadow-lg"
          />
        </div>
        {/* Media Info Section */}
        <section className="relative order-1 flex w-2/3 flex-col items-start justify-start overflow-hidden sm:order-2 sm:w-1/2">
          <div className="flex min-w-0 max-w-full flex-row items-end justify-start">
            <h2 className="min-w-0 overflow-x-auto no-scrollbar sm:flex-1 sm:whitespace-nowrap">
              {data.title}
            </h2>
            <h3 className="ml-2 hidden font-light leading-relaxed sm:block">
              {formatDateYear(data.release_date)}
            </h3>
          </div>
          <div className="hidden max-w-full flex-row flex-nowrap gap-2 overflow-x-auto no-scrollbar sm:flex">
            <Badge variant="secondary" title="Age Rating">
              {data.age_rating}
            </Badge>
            <pre>|</pre>
            {data.genres.map((genre, i) => (
              <Badge variant="outline" className="relative" key={i}>
                {genre}
                <Link
                  to={`/genre/${genre.toLowerCase()}`}
                  className="absolute left-0 top-0 h-full w-full"
                />
              </Badge>
            ))}
          </div>
          <p className="hidden overflow-hidden overflow-y-scroll text-ellipsis py-3 font-light leading-tight no-scrollbar sm:block">
            {data.description}
          </p>
          <div className="flex flex-row">
            <Button
              className="mr-2 flex-row space-x-2 pl-0"
              size="sm"
              variant="ghost"
              onClick={handleLike}
            >
              <Heart
                className="size-5"
                fill={isLiked ? "white" : "transparent"}
              />
              <h4>Love It</h4>
            </Button>
            <Button
              className="mr-2 flex-row space-x-2 pl-0"
              size="sm"
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <MessagesSquare className="size-5" />
              <h4>Tell a Friend</h4>
            </Button>
          </div>
        </section>
        {/* Write Review Section */}
        <section className="relative z-10 order-3 hidden h-full w-1/4 flex-col space-y-2 sm:flex">
          <p>Leave a Rating</p>
          <div className="flex">
            <StarRatings
              name="user-rating-d"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue);
              }}
              icon={
                <StarRounded
                  className="m-[-3px] text-primary"
                  fontSize="inherit"
                />
              }
              emptyIcon={
                <StarBorderRounded
                  className="m-[-3px] text-white/90"
                  fontSize="inherit"
                />
              }
              sx={{ fontSize: "3rem" }}
            />
          </div>
          <p>Share your thoughts</p>
          <Textarea
            placeholder={"Write your thoughts and opinions for others to see"}
            className={cn(
              "h-full resize-none border-neutral-500 focus:border-white",
              userWasSilly && "border-red-500",
            )}
            value={review}
            onChange={handleType}
          />
          {userWasSilly && (
            <p className="text-xs text-red-500">
              You have to choose a rating silly!
            </p>
          )}
          <Button
            variant="outline"
            className="flex-row gap-x-2 self-end justify-self-end bg-transparent"
            onClick={handleAddReview}
          >
            Submit Review <Send size="10" />
          </Button>
        </section>
      </section>
      <section className="relative flex w-full flex-col gap-x-5 sm:hidden">
        <div className="flex max-w-full flex-row flex-wrap gap-2">
          <Badge variant="secondary" title="Age Rating">
            {data.age_rating}
          </Badge>
          <pre>|</pre>
          {data.genres.map((genre, i) => (
            <Badge variant="outline" key={i}>
              {genre}
            </Badge>
          ))}
        </div>
        <p className="py-3 font-light leading-tight no-scrollbar">
          {data.description}
        </p>
        <section className="relative z-10 flex w-full flex-col space-y-2">
          <div className="flex flex-row items-center gap-4">
            <h4>Leave a Rating</h4>
            <div className="flex">
              <StarRatings
                name="user-rating-mb"
                defaultValue={rating ? rating / 2 : 0}
                value={rating}
                onChange={(_, newValue) => {
                  setRating(newValue);
                }}
                icon={
                  <StarRounded
                    className="m-[-3px] text-primary"
                    fontSize="inherit"
                  />
                }
                emptyIcon={
                  <StarBorderRounded
                    className="m-[-3px] text-white/90"
                    fontSize="inherit"
                  />
                }
                sx={{ fontSize: "3rem" }}
              />
            </div>
          </div>
          <h4>Share your thoughts</h4>
          <Textarea
            placeholder={"Write your thoughts and opinions for others to see"}
            className={cn(
              "h-32 border-neutral-500 focus:border-white",
              userWasSilly && "border-red-500",
            )}
            value={review}
            onChange={handleType}
          />
          {userWasSilly && (
            <p className="text-xs text-red-500">
              You have to choose a rating silly!
            </p>
          )}
          <Button
            variant="outline"
            className="flex-row gap-x-2 self-end justify-self-end bg-transparent"
            onClick={handleAddReview}
          >
            Submit Review <Send size="10" />
          </Button>
        </section>
      </section>
      {/* Bottom Section */}
      <section className="relative flex w-full flex-col gap-x-5 sm:flex-row">
        <section className="flex h-full w-full flex-col justify-start sm:w-1/4">
          {/* Media Stats */}
          <div className="flex flex-row justify-center space-x-4 text-gray-300">
            <div className="flex flex-row items-center justify-center space-x-1 sm:hidden">
              <AccessTimeRounded className="fill-gray-300" />
              <h4>{data.runtime}m</h4>
            </div>
            <div className="flex flex-row items-center justify-center space-x-1 sm:hidden">
              <CalendarMonthRounded className="fill-gray-300" />
              <h4>{formatDateYear(data.release_date)}</h4>
            </div>
            <div className="pr-4 sm:hidden" />
            <div className="flex flex-row items-center justify-center space-x-1">
              <SignalCellularAlt className="size-5 fill-gray-300" />
              <h4>{formatInteger(data.rating)}</h4>
            </div>
            <div className="flex flex-row items-center justify-center space-x-1">
              <StarRounded className="size-4 fill-gray-300" />
              <h4>{userRating ? userRating / 2 : "~"}</h4>
            </div>
            <div className="flex flex-row items-center justify-center space-x-1">
              <Heart className="size-4 fill-gray-300" />
              <h4>{formatInteger(numLikes)}</h4>
            </div>
          </div>
          {/* Watch Providers */}
          <div className="mt-2 flex max-h-64 flex-col rounded-md outline outline-gray-secondary">
            <h4 className="rounded-t-md bg-gray-secondary p-2 font-bold">
              Where to Watch
            </h4>
            <Select
              onValueChange={(value) => setRegion(value)}
              defaultValue="US"
            >
              <SelectTrigger className="text- w-full rounded-none border-gray-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {watchProviders &&
                  watchProviders.map(({ region }) => (
                    <SelectItem value={region} key={crypto.randomUUID()}>
                      {region}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {regionData && (
              <div className="flex h-full flex-col space-y-2 overflow-y-auto py-3">
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg"
                  className="aspect-auto max-h-4 self-start pl-2"
                />
                {regionData.providers.map(([offer, providers]) => (
                  <div key={crypto.randomUUID()} className="flex flex-col">
                    <h5 className="ml-2 font-bold first-letter:capitalize">
                      {offer === "flatrate" ? "stream" : offer}
                    </h5>
                    <hr className="mx-2 border-neutral-500" />
                    {providers.map((provider) => (
                      <a
                        className="ml-2 mt-1 flex flex-row items-center"
                        key={crypto.randomUUID()}
                        target="_blank"
                        href={regionData.link as string}
                      >
                        <img
                          src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`}
                          alt="provider logo"
                          className="mr-1 size-4 rounded-sm"
                        />
                        <p>{provider.provider_name}</p>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="flex h-full w-full flex-col justify-start pt-5 sm:w-3/4 sm:pt-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews">
              <h3 className="font-light">See What Others Are Saying</h3>
              <Separator />
              {reviewData && (
                <div className="mt-3 flex flex-col gap-y-4">
                  {!reviewData.reviews.length ? (
                    <>
                      <h4 className="text-gray-400">
                        Be the first to write a review!
                      </h4>
                      <img
                        src={empty}
                        className="w-3/4 justify-self-center sm:h-1/3 sm:w-1/3"
                      />
                    </>
                  ) : (
                    constructReviewLog(reviewData).map((userReview) => {
                      if (!userReview.comment) return null;
                      return (
                        <div key={userReview.id}>
                          <ReviewSection
                            userReview={userReview}
                            isLiked={
                              !!reviewsLikedByUser &&
                              reviewsLikedByUser.includes(userReview.id)
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="recommendations">
              <h3 className="font-light leading-tight">
                Similar to {data.title}
              </h3>
              <Separator className="mb-3" />
              {isRecommendationsLoading || isRecommendationsPending ? (
                <LoadingSpinner />
              ) : isRecommendationsError ? (
                <div> An Error Occured </div>
              ) : (
                <div>
                  <MediaCarousel
                    media={recommendations}
                    slidesPerViewMobile={3}
                    slidesPerViewDesktop={4}
                    spaceBetweenMobile={8}
                    spaceBetweenDesktop={16}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </div>
  );
}

const constructReviewLog = (reviewData: TReviewResponse) => {
  const { reviews, replies } = reviewData;
  const reviewLog = reviews.map((review) => {
    return {
      ...review,
      replies: replies.filter((reply) => reply.parent_id === review.id),
    };
  });
  return reviewLog;
};

export type TReviewLog = ReturnType<typeof constructReviewLog>;

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MessagesSquare, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { TMedia } from "@/types/media";
import { useMedia } from "@/hooks/useMedia";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { searchMedia } from "@/api/media";
import empty from "@/assets/empty.png";
import { formatDateYear } from "@/utils/formatDate";
import { useAuth } from "@/context/auth";
import { formatInteger } from "@/utils/formatInteger";
import { StarRatings } from "./components/starRatings";
import { ReviewCard } from "./components/reviewCard";
import { cn } from "@/lib/utils";
import { SignalCellularAlt, StarRounded } from "@mui/icons-material";

export function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [ratingPreview, setRatingPreview] = useState(0);
  const [review, setReview] = useState("");
  const [userWasSilly, setUserWasSilly] = useState(false);

  function handleAddReview() {
    if (rating === 0) {
      setUserWasSilly(true);
    } else {
      updateReview({ comment: review, rating: rating });
    }
  }

  function handleType(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserWasSilly(false);
    setReview(e.target.value);
  }

  const checkAuth = () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const { isLiked, updateLikes, numLikes, reviews, updateReview, userRating } =
    useMedia(id as string, user?.id ?? "");

  const { isPending, error, data } = useQuery<TMedia>({
    queryKey: ["media", id],
    queryFn: () => searchMedia({ id } as { id: string }),
  });

  const handleLike = () => {
    // First check if there is an existing auth token
    if (checkAuth()) return;
    updateLikes();
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-fit w-full flex-col items-start justify-center bg-black px-4 py-8 text-gray-100 sm:px-6 lg:px-8">
      <section className="relative flex h-96 w-full flex-row gap-x-5">
        {/* blurred background image */}
        <div
          className="absolute z-0 h-5/6 w-full self-center justify-self-center overflow-hidden opacity-30"
          style={{
            background: `url(${data.thumbnail_url}) lightgray 50% / cover no-repeat`,
            filter: "blur(15px)",
          }}
        />
        {/* Poster Image */}
        <div className="relative z-10 w-1/4">
          <img
            src={data.thumbnail_url}
            alt="Poster Thumbnail"
            className="max-h-full max-w-full rounded-lg object-scale-down shadow-lg"
          />
        </div>
        {/* Media Info Section */}
        <section className="relative flex w-1/2 flex-col items-start justify-start overflow-hidden">
          <div className="flex min-w-0 max-w-full flex-row items-end justify-start">
            <h1 className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap no-scrollbar">
              {data.title}
            </h1>
            <h3 className="ml-2 font-light leading-loose">
              {formatDateYear(new Date(data.release_date))}
            </h3>
          </div>
          <div className="flex max-w-full flex-row overflow-x-auto no-scrollbar">
            <Badge variant="secondary" className="mr-2" title="Age Rating">
              {data.age_rating}
            </Badge>
            <pre>| </pre>
            {data.genres.map((genre, i) => (
              <Badge variant="outline" className="mr-2" key={i}>
                {genre}
              </Badge>
            ))}
          </div>
          <p className="overflow-hidden overflow-y-scroll text-ellipsis py-3 font-light leading-tight no-scrollbar">
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
            >
              <MessagesSquare className="size-5" />
              <h4>Tell a Friend</h4>
            </Button>
          </div>
        </section>
        {/* Write Review Section */}
        <section className="relative z-10 flex h-full w-1/4 flex-col space-y-2">
          <p>Leave a Rating</p>
          <div className="flex">
            {[...Array(10)].map((_, i) => (
              <StarRatings
                key={i}
                className={cn(
                  ratingPreview > i || rating > i
                    ? `fill-primary text-primary`
                    : `text-white`,
                )}
                i={i}
                width="16px"
                height="32px"
                onMouseOver={() => setRatingPreview(i + 1)}
                onMouseOut={() => setRatingPreview(0)}
                onClick={() => setRating(i + 1)}
              />
            ))}
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
      {/* Bottom Section Reviews */}
      <section className="relative flex w-full flex-row">
        <div className="flex h-full w-1/4 flex-row justify-center space-x-4 text-gray-300">
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
        <section className="flex h-full w-3/4 flex-col justify-start">
          <h3 className="font-light">See What Others Are Saying</h3>
          {reviews && (
            <div className="mt-3 flex flex-col">
              {!reviews?.length ? (
                <>
                  <h4 className="text-gray-400">
                    Be the first to write a review!
                  </h4>
                  <img
                    src={empty}
                    className="h-1/3 w-1/3 justify-self-center"
                  />
                </>
              ) : (
                reviews.map(
                  (review) =>
                    review.comment != "" &&
                    review.comment != undefined && (
                      <ReviewCard review={review} key={crypto.randomUUID()} />
                    ),
                )
              )}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export const AddReviewButtonStar = ({
  i,
  filled,
  setRating,
  setRatingPreview,
}: {
  i: number;
  filled: boolean;
  setRating: (x: number) => void;
  setRatingPreview: (x: number) => void;
}) => {
  return (
    <Star
      className={filled ? `fill-primary text-primary` : `text-gray-400`}
      onMouseOver={() => setRatingPreview(i + 1)}
      onMouseOut={() => setRatingPreview(0)}
      onClick={() => setRating(i + 1)}
    />
  );
};

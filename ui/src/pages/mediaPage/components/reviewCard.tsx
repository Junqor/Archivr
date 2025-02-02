import { TReview } from "@/api/media";
import { useState } from "react";
import { StarRatings } from "./starRatings";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewKebab } from "./reviewKebab";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";

export const ReviewCard = ({ review }: { review: TReview }) => {
  const [expanded, setExpanded] = useState(false);
  const maxUnexpandedCommentCharacters = 400;
  const isTooLong = () => {
    return review.comment.length > maxUnexpandedCommentCharacters;
  };
  const truncatedComment = () => {
    return review.comment.substring(0, maxUnexpandedCommentCharacters) + "...";
  };
  // todo: Replace with liked state
  const isLiked = true;
  const numLikes = 0;
  return (
    <section className="mb-4 flex flex-col gap-y-2 rounded-xl border-none bg-gray-secondary p-4 review-gradient">
      <div className="flex flex-row items-center gap-x-2 space-y-0">
        {/* // todo: Replace with avatar image */}
        <img
          src={
            "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=cheeseball&backgroundColor=c0aede"
          }
          className="size-7 rounded-full"
        />
        <h5>{review.username}</h5>
        <div className="ml-auto flex items-center">
          <Heart
            className={cn(
              isLiked ? "fill-primary text-primary" : "text-gray-200",
              "mr-2 size-5",
            )}
          />
          {[...Array(10)].map((_, i) => (
            <StarRatings
              key={i}
              i={i}
              className={cn(
                "text-gray-200",
                i < review.rating && "fill-gray-200",
                i % 2 === 0 && "ml-1",
              )}
              width="8px"
              height="16px"
            />
          ))}
        </div>
        <ReviewKebab review={review} />
      </div>
      <p className="min-h-8 text-gray-300">
        {expanded || !isTooLong() ? review.comment : truncatedComment()}
      </p>
      {isTooLong() && (
        <div>
          <button
            onClick={() => {
              setExpanded(!expanded);
            }}
            className="underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
      <div className="flex flex-row items-center justify-start">
        <p className="text-sm text-gray-400">
          {formatDate(new Date(review.created_at))}
        </p>

        <Button variant="ghost" className="group ml-auto p-0 hover:text-white">
          <Heart className="size-4 group-hover:fill-purple group-hover:text-purple" />
          <p className="ml-2">{numLikes} Likes</p>
        </Button>
      </div>
    </section>
  );
};

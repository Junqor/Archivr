import { TReview } from "@/api/reviews";
import { useState } from "react";
import { StarRatings } from "./starRatings";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewKebab } from "./reviewKebab";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeReview } from "@/api/reviews";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/auth";

export const ReviewCard = ({
  review,
  isLiked,
}: {
  review: TReview;
  isLiked: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { mutate: handleLikeReview } = useMutation({
    mutationFn: () => likeReview(review.id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["media", id, "reviews/check-likes"],
        exact: true,
      });

      const previousData = queryClient.getQueryData<number[]>([
        "media",
        id,
        "reviews/check-likes",
      ]);

      if (previousData) {
        queryClient.setQueryData(
          ["media", id, "reviews/check-likes"],
          previousData.includes(review.id)
            ? previousData.filter((id) => id !== review.id)
            : [...previousData, review.id],
        );
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(
          ["media", id, "reviews/check-likes"],
          context.previousData,
        );
      }
      if (_err.message === "Unauthorized") {
        logout();
        return navigate("/login", {
          state: { from: window.location.pathname },
        });
      }
      toast.error("An unexpected error occurred");
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["media", id, "reviews/check-likes"],
        exact: true,
      });
    },
  });

  const maxUnexpandedCommentCharacters = 400;

  const isTooLong = () => {
    return review.comment.length > maxUnexpandedCommentCharacters;
  };

  const truncatedComment = () => {
    return review.comment.substring(0, maxUnexpandedCommentCharacters) + "...";
  };

  return (
    <section className="mb-4 flex flex-col gap-y-2 rounded-xl border-none bg-gray-secondary p-4">
      <div className="flex flex-row items-center gap-x-2 space-y-0">
        <img src={import.meta.env.VITE_API_URL+"/user/pfp/"+review.user_id} className="size-[2rem] rounded-[2rem]"></img>
        <a href={"/profile/"+review.user_id} className="text-white transition-colors hover:text-purple cursor-pointer">
          <h5>{review.display_name ? review.display_name : review.username}</h5>
        </a>
        <div className="ml-auto flex items-center">
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
            className="hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
      <div className="flex flex-row items-center justify-start">
        <p className="text-sm text-gray-400">{formatDate(review.created_at)}</p>

        <Button
          variant="ghost"
          className="group ml-auto p-0 hover:text-white"
          onClick={() => handleLikeReview()}
        >
          <Heart
            className={cn(
              isLiked && "fill-white",
              "size-4 group-hover:fill-white group-hover:text-purple",
            )}
          />
          <p className="ml-2">{review.likes} Likes</p>
        </Button>
      </div>
    </section>
  );
};

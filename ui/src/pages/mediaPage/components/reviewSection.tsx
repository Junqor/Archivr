import { StarRatings } from "../../../components/starRatings";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewKebab } from "./reviewKebab";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeReview, postReply, TReviewResponse } from "@/api/reviews";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { UserAvatar } from "@/components/ui/avatar";
import { CollapsedText } from "@/components/ui/collapsed-text";
import { useState } from "react";
import { TReviewLog } from "../mediaPage";
import { Comment, Reply } from "@mui/icons-material";
import { ReplyKebab } from "./replyKebab";
import { ReplyForm } from "./replyForm";

export const ReviewSection = ({
  userReview,
  isLiked,
}: {
  userReview: TReviewLog[0];
  isLiked: boolean;
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [visibleReplyCount, setVisibleReplyCount] = useState(0);
  const [maxShownReplyCount, setMaxShownReplyCount] = useState(0); // save the state of the shown replies
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { mutate: handleLikeReview } = useMutation({
    mutationFn: () => likeReview(review.id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["media", id, "reviews/check-likes"],
        exact: true,
      });

      const currentUserLikes = queryClient.getQueryData<number[]>([
        "media",
        id,
        "reviews/check-likes",
      ]);

      const reviewData = queryClient.getQueryData<TReviewResponse>([
        "media",
        id,
        "reviews",
      ]);

      if (currentUserLikes && reviewData) {
        if (currentUserLikes.includes(review.id)) {
          // If the current user has it liked, then unlike
          queryClient.setQueryData(
            ["media", id, "reviews/check-likes"],
            currentUserLikes.filter((id) => id !== review.id),
          );
          queryClient.setQueryData<TReviewResponse>(["media", id, "reviews"], {
            ...reviewData,
            reviews: reviewData.reviews.map(
              (r) =>
                r.id === userReview.id ? { ...r, likes: r.likes - 1 } : r, // remove a like
            ),
          });
        } else {
          // Else like it
          queryClient.setQueryData(
            ["media", id, "reviews/check-likes"],
            [...currentUserLikes, review.id],
          );
          queryClient.setQueryData<TReviewResponse>(["media", id, "reviews"], {
            ...reviewData,
            reviews: reviewData.reviews.map(
              (r) =>
                r.id === userReview.id ? { ...r, likes: r.likes + 1 } : r, // add a like
            ),
          });
        }
      }

      return { currentUserLikes };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.currentUserLikes) {
        queryClient.setQueryData(
          ["media", id, "reviews/check-likes"],
          context.currentUserLikes,
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

  const { mutate: replyMutation } = useMutation({
    mutationFn: (text: string) => postReply({ reviewId: review.id, text }),
    onSuccess: () => {
      toast.success("Reply posted!");
      queryClient.invalidateQueries({
        queryKey: ["media", id, "reviews"],
        exact: true,
      });
      setReplyingTo(null);
    },
    onError: (err, _variables, _context) => {
      if (err.message === "Unauthorized") {
        logout();
        return navigate("/login", {
          state: { from: window.location.pathname },
        });
      }
      toast.error("An unexpected error occurred");
    },
  });

  const { user, ...review } = userReview;

  const numReplies = review.replies.length;

  const handleHideReplies = () => {
    setVisibleReplyCount(0);
  };

  const handleViewReplies = () => {
    setVisibleReplyCount((prev) => Math.max(prev + 3, maxShownReplyCount));
  };

  const handleShowMoreReplies = () => {
    setMaxShownReplyCount((prev) => Math.max(prev, visibleReplyCount + 3));
    setVisibleReplyCount((prev) => prev + 3);
  };

  const handleStartReply = (username: string) => {
    // If they're not logged in, redirect them to the login page
    if (!user) {
      logout();
      return navigate("/login", {
        state: { from: window.location.pathname },
      });
    } else setReplyingTo(username);
  };

  const handleSubmitReply = (text: string) => {
    if (text.trim().length < 5) {
      toast.error("Reply must be at least 5 characters long");
      return;
    }
    replyMutation(text);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <section className="flex flex-col">
      {/* Review */}
      <div className="flex flex-col gap-y-2 rounded-xl border-none bg-gray-secondary p-4 text-white">
        <div className="flex flex-row items-center gap-x-2 space-y-0">
          <UserAvatar user={user} size="small" />
          <Link to={`/profile/${user.username}`}>
            <h5 className="transition-colors hover:text-purple">
              {user.display_name || user.username}
            </h5>
          </Link>
          <div className="ml-auto flex items-center">
            <StarRatings readOnly value={review.rating / 2} />
          </div>
          <ReviewKebab review={review} />
        </div>
        <CollapsedText text={review.comment} max_length={400}></CollapsedText>
        <div className="flex flex-row items-center justify-start gap-x-4">
          <p className="text-sm text-gray-400">
            {formatDate(review.created_at, true)}
          </p>
          <Button
            variant="ghost"
            className="group ml-auto p-0 hover:text-white"
            onClick={() => handleLikeReview()}
          >
            <Heart
              className={cn(
                isLiked && "fill-white",
                "size-5 group-hover:fill-white group-hover:text-purple",
              )}
            />
            <p className="ml-2">{review.likes} Likes</p>
          </Button>
          {numReplies > 0 ? (
            visibleReplyCount === 0 ? (
              <Button
                variant="ghost"
                className="gap-x-2 p-0"
                onClick={handleViewReplies}
              >
                <Comment sx={{ fontSize: "1.25rem" }} />
                View Replies
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="p-0"
                onClick={handleHideReplies}
              >
                Hide Replies{" "}
                <ChevronUp className="size-5 justify-self-center" />
              </Button>
            )
          ) : (
            <Button
              variant="ghost"
              className="gap-x-2 p-0"
              onClick={() => handleStartReply(review.username)}
            >
              <Reply sx={{ fontSize: "1.25rem" }} className="mb-1" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      {visibleReplyCount > 0 && (
        <div className="ml-12 flex flex-col">
          {review.replies.slice(0, visibleReplyCount).map((reply, i) => {
            return (
              <>
                <div
                  className="ml-12 h-8 w-px bg-gray-secondary"
                  key={crypto.randomUUID()}
                />
                <div className="flex flex-col gap-y-2 rounded-xl border-none bg-gray-secondary p-4 text-white">
                  <div
                    key={reply.id}
                    className="flex flex-row items-center gap-x-2 space-y-0"
                  >
                    <UserAvatar user={reply.user} size="small" />
                    <Link
                      to={`/profile/${reply.user.username}`}
                      className="mr-auto"
                    >
                      <h5 className="transition-colors hover:text-purple">
                        {reply.user.display_name || reply.user.username}
                      </h5>
                    </Link>
                    <ReplyKebab reply={reply} mediaId={userReview.media_id} />
                  </div>
                  <CollapsedText text={reply.text} max_length={400} />
                  <div className="flex flex-row items-center justify-start gap-x-4">
                    <p className="text-sm text-gray-400">
                      {formatDate(reply.created_at, true)}
                    </p>
                    <Button
                      variant="ghost"
                      className="ml-auto gap-x-2 p-0"
                      onClick={() => handleStartReply(reply.user.username)}
                    >
                      <Reply sx={{ fontSize: "1.25rem" }} className="mb-1" />
                      Reply
                    </Button>
                    {i === visibleReplyCount - 1 &&
                      numReplies > visibleReplyCount && (
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={handleShowMoreReplies}
                        >
                          View More <ChevronDown className="size-5" />
                        </Button>
                      )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}

      {/* Reply Text Box */}
      {replyingTo && (
        <div className="ml-12 flex flex-col">
          <div className="ml-12 h-8 w-px bg-gray-secondary" />
          <ReplyForm
            handleSubmit={handleSubmitReply}
            handleCancel={handleCancelReply}
            replyTo={replyingTo}
          />
        </div>
      )}
    </section>
  );
};

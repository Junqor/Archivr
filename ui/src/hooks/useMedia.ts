import {
  getLikedStatus,
  getLikes,
  getUserRating,
  updateLikes,
} from "@/api/media";
import { getReviews, updateReview } from "@/api/reviews";
import { useAuth } from "@/context/auth";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMedia = (mediaId: string, userId: string) => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: mediaData } = useQuery({
    queryKey: ["media", mediaId, "likes"],
    queryFn: async (): Promise<{ isLiked: boolean; numLikes: number }> => {
      const [likes, isLiked] = await Promise.all([
        getLikes({ mediaId }),
        getLikedStatus({ mediaId, userId }),
      ]);

      return {
        isLiked: isLiked,
        numLikes: likes,
      };
    },
  });

  const { mutate: updateLikesMutation } = useMutation({
    mutationFn: () => updateLikes({ mediaId }),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["media", mediaId, "likes"],
        exact: true,
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<{
        isLiked: boolean;
        numLikes: number;
      }>(["media", mediaId, "likes"]);

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData(["media", mediaId, "likes"], {
          isLiked: !previousData.isLiked,
          numLikes: previousData.isLiked
            ? previousData.numLikes - 1
            : previousData.numLikes + 1,
        });
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(
          ["media", mediaId, "likes"],
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
        queryKey: ["media", mediaId, "likes"],
        exact: true,
      });
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["media", mediaId, "reviews"],
    queryFn: () => getReviews({ mediaId }),
  });

  const { mutate: updateReviewMutation } = useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      updateReview({ mediaId, comment, rating }),
    onSuccess: () => {
      toast.success("Review updated!");
    },
    onError: (_err, _variables, _context) => {
      if (_err.message === "Unauthorized") {
        logout();
        return navigate("/login", {
          state: { from: window.location.pathname },
        });
      }
      toast.error("An unexpected error occurred");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["media", mediaId, "reviews"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["media", mediaId, "rating"],
        exact: true,
      });
      // Refetch list status since it should be completed now
      queryClient.invalidateQueries({
        queryKey: trpc.lists.getUsersMediaList.queryOptions({
          mediaId: parseInt(mediaId),
        }).queryKey,
      });
    },
  });

  const { data: ratingData } = useQuery({
    queryKey: ["media", mediaId, "rating"],
    queryFn: () => getUserRating({ mediaId }),
  });

  return {
    isLiked: mediaData?.isLiked ?? false,
    numLikes: mediaData?.numLikes ?? 0,
    updateLikes: updateLikesMutation,
    reviewData: reviewsData,
    updateReview: updateReviewMutation,
    userRating: ratingData,
  };
};

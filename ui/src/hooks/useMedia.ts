import {
  getLikedStatus,
  getLikes,
  getReviews,
  updateLikes,
  updateReview,
} from "@/api/media";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMedia = (mediaId: string, userId: string) => {
  const queryClient = useQueryClient();

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
    mutationFn: () => updateLikes({ mediaId, userId }),
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
          context.previousData
        );
      }
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
    mutationFn: ({ comment }: { comment: string }) =>
      updateReview({ mediaId, userId, comment }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["media", mediaId, "reviews"],
        exact: true,
      });
    },
  });

  return {
    isLiked: mediaData?.isLiked ?? false,
    numLikes: mediaData?.numLikes ?? 0,
    updateLikes: updateLikesMutation,
    reviews: reviewsData,
    updateReview: updateReviewMutation,
  };
};

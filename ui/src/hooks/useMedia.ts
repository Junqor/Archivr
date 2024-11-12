import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TLikeResponse = {
  status: string;
  likes: number;
  liked?: boolean;
};

export type TReview = {
  username: string;
  comment: string;
  created_at: string;
  rating: number;
};

export type TUpdateReviewArgs = {
  media_id: string;
  user_id: string;
  comment: string;
  rating?: number;
};

export const useMedia = (mediaId: string, userId: string) => {
  const queryClient = useQueryClient();

  const { data: mediaData } = useQuery({
    queryKey: ["media", mediaId, "likes"],
    queryFn: async (): Promise<{ isLiked: boolean; numLikes: number }> => {
      const [likesResponse, likedStatusResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/media/likes/${mediaId}`),
        fetch(
          `${import.meta.env.VITE_API_URL}/media/likes/${mediaId}/${userId}`
        ),
      ]);

      if (!likesResponse.ok || !likedStatusResponse.ok) {
        throw new Error("Failed to fetch media data");
      }

      const [likesData, likedData] = await Promise.all([
        likesResponse.json(),
        likedStatusResponse.json(),
      ]);

      if (likesData.status !== "success") {
        throw new Error("Failed to fetch likes");
      }

      return {
        isLiked: likedData.liked,
        numLikes: likesData.likes,
      };
    },
  });

  const { mutate: updateLikes } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/media/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_id: parseInt(mediaId),
            user_id: parseInt(userId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      const data: TLikeResponse = await response.json();
      if (data.status !== "success") {
        throw new Error("Failed to update like status");
      }

      return data;
    },
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
    queryFn: async () => {
      const [reviewsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/media/reviews/${mediaId}`),
      ]);

      if (!reviewsResponse.ok) {
        throw new Error("Failed to fetch review data");
      }

      const reviewsData = await reviewsResponse.json();

      if (reviewsData.status !== "success") {
        throw new Error("Failed to fetch reviews");
      }

      return reviewsData.reviews as TReview[];
    },
  });

  const { mutate: updateReview } = useMutation({
    mutationFn: async ({
      media_id,
      user_id,
      comment,
      rating = 0,
    }: TUpdateReviewArgs) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/media/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_id: parseInt(media_id),
            user_id: parseInt(user_id),
            comment: comment,
            rating: rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error("Failed to update review");
      }

      return data.review as TReview;
    },
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
    updateLikes,
    reviews: reviewsData,
    updateReview,
  };
};

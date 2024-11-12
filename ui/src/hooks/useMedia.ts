import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface LikeResponse {
  status: string;
  likes: number;
  liked?: boolean;
}

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

  const mutation = useMutation({
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

      const data: LikeResponse = await response.json();
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

  return {
    isLiked: mediaData?.isLiked ?? false,
    numLikes: mediaData?.numLikes ?? 0,
    updateLikes: () => mutation.mutate(),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

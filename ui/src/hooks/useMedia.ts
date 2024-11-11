import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useMedia = (mediaId: string, userId: string) => {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  useQuery({
    queryKey: ["media", mediaId, "liked"],
    queryFn: () => checkIfMediaIsLiked(mediaId, userId),
  });

  const { data: numLikes } = useQuery({
    queryKey: ["media", mediaId, "likes"],
    queryFn: () => fetchLikes(mediaId),
  });

  const { mutate: updateLikes } = useMutation({
    mutationFn: () => updateMediaLikes(mediaId, userId),
    onMutate: async () => {
      // Cancel any previous queries to prevent overwriting the optimistic update
      await queryClient.cancelQueries({
        queryKey: ["media", mediaId, "liked"],
      });

      const prevLikes = await queryClient.getQueryData([
        "media",
        mediaId,
        "likes",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["media", mediaId, "likes"],
        (oldLikes: number) => (isLiked ? oldLikes - 1 : oldLikes + 1)
      );

      // Return a context object with the snapshotted value
      return { prevLikes };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.prevLikes);
    },
    onSuccess: () => {
      setIsLiked((isLiked) => !isLiked);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["media", mediaId, "likes"] });
    },
  });

  // Check if user has liked a given media
  async function checkIfMediaIsLiked(mediaId: string, userId: string) {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/media/likes`,
        {
          body: JSON.stringify({ media_id: mediaId, user_id: userId }),
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch liked status");
      }
      const json = await response.json();
      if (json.liked === "true") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
      setIsLiked(false);
      return;
    }
  }

  return { updateLikes, isLiked, numLikes };
};

// Get the number of likes for a given media
async function fetchLikes(mediaId: string) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + `/media/likes`,
      {
        body: JSON.stringify({ media_id: mediaId }),
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch likes");
    }
    const json = await response.json();
    if (json.status !== "success") {
      throw new Error("Failed to fetch likes");
    }
    return json.likes;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

// Like or unlike a media
async function updateMediaLikes(mediaId: string, userId: string) {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + `/media/like`, {
      body: JSON.stringify({ media_id: mediaId, user_id: userId }),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to update likes");
    }
    const json = await response.json();
    if (json.status !== "success") {
      throw new Error("Failed to update likes");
    }
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}

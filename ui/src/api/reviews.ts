import { getAuthHeader } from "@/utils/authHeader";

export type TReview = {
  id: number;
  user_id: number;
  media_id: number;
  username: string;
  display_name: string;
  comment: string;
  created_at: string;
  rating: number;
  likes: number;
};

export type UpdateReviewArgs = {
  mediaId: string;
  comment: string;
  rating?: number;
};

export const updateReview = async ({
  mediaId,
  comment,
  rating = 5,
}: UpdateReviewArgs) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/media/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      media_id: parseInt(mediaId),
      comment: comment,
      rating: rating,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to update review");
  }

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to update review");
  }

  return data.review as TReview;
};

export const getReviews = async ({ mediaId }: { mediaId: string }) => {
  const reviewsResponse = await fetch(
    `${import.meta.env.VITE_API_URL}/media/reviews/${mediaId}`,
  );

  if (!reviewsResponse.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const reviewsData = await reviewsResponse.json();

  if (reviewsData.status !== "success") {
    throw new Error("Failed to fetch reviews");
  }

  return reviewsData.reviews as TReview[];
};

export const deleteReview = async (reviewId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews/${reviewId}`,
    {
      method: "DELETE",
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }

  const data = await response.json();

  return data;
};

export const likeReview = async (reviewId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews/like/${reviewId}`,
    {
      method: "POST",
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to like review");
  }

  const data = await response.json();

  return data;
};

// Returns if the user has liked the reviews on the media
export const checkLikes = async (mediaId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews/check-likes/${mediaId}`,
    {
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  if (data.status !== "success") {
    return [];
  }

  const likes = data.likes.map(
    (like: { reviewId: number }) => like.reviewId,
  ) as number[];

  return likes;
};

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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
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

type UserInfo = {
  username: string;
  avatar_url: string | null;
  role: "user" | "admin";
  display_name: string;
};

export type TReviewBlob = {
  user: UserInfo;
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

export type TReplyBlob = {
  user: UserInfo;
  id: number;
  parent_id: number;
  user_id: number;
  text: string;
  created_at: string;
  updated_at: string;
};

export type TReviewResponse = {
  reviews: TReviewBlob[];
  replies: TReplyBlob[];
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

  return reviewsData.data as TReviewResponse;
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

export const getUserReviewAndRating = async (mediaId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/reviews/review-rating/" + mediaId,
    {
      headers: getAuthHeader(),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user review and rating");
  }

  const data = await response.json();

  return data.data as { rating: number | null; review: string | null };
};

export const postReply = async (reply: { reviewId: number; text: string }) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews/reply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(reply),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to post reply");
  }

  const data = await response.json();

  return data;
};

export const deleteReply = async (replyId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews/reply/${replyId}`,
    {
      method: "DELETE",
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete reply");
  }

  const data = await response.json();

  return data;
};

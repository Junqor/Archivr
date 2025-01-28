import { TMedia } from "@/types/media";
import { getAuthHeader } from "@/utils/authHeader";

// Search for media(s) by title
export const searchMedias = async (
  query: string,
  limit: number = 5,
  offset: number = 1
) => {
  if (!query) {
    return []; // Do not search if no query is provided
  }

  const url = import.meta.env.VITE_API_URL + "/search";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit, offset }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const data = (await response.json()) satisfies {
      status: string;
      media: TMedia[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch media");
    }

    return data.media;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Search for a specific media by ID
export const searchMedia = async ({ id }: { id: string }) =>
  await fetch(import.meta.env.VITE_API_URL + `/search/${id}`).then(
    async (res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch media");
      }
      const result = await res.json();
      if (result.status !== "success") {
        throw new Error("Failed to fetch media");
      }
      return result.media as TMedia;
    }
  );

export const getMostPopular = async (): Promise<TMedia[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/media/popular");
  const data = await response.json();
  return data.media as TMedia[];
};

export const getRecentlyReviewed = async (): Promise<TMedia[]> => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/media/recent-reviews"
  );
  const data = await response.json();
  return data.media as TMedia[];
};

export const getTrending = async (): Promise<TMedia[]> => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/media/trending"
  );
  const data = await response.json();
  return data.media as TMedia[];
};

export const getNewForYou = async (userId: number): Promise<TMedia[]> => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/media/new-for-you" + `?user_id=${userId}`
  );
  const data = await response.json();
  return data.media as TMedia[];
};

export const getUserStats = async (userId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/media/stats/${userId}`
  );
  const data = await response.json();
  return data;
};

type GetLikesArgs = {
  mediaId: string;
};

export const getLikes = async ({ mediaId }: GetLikesArgs): Promise<number> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/media/likes/${mediaId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch media data");
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error("Failed to fetch likes");
  }

  return data.likes as number;
};

type GetLikedStatusArgs = {
  mediaId: string;
  userId: string;
};

// Returns true if the user has liked the media
export const getLikedStatus = async ({
  mediaId,
  userId,
}: GetLikedStatusArgs): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/media/likes/${mediaId}/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch media data");
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error("Failed to fetch likes");
  }

  return data.liked as boolean;
};

export type TLikeResponse = {
  status: string;
  likes: number;
  liked?: boolean;
};

export const updateLikes = async ({ mediaId }: { mediaId: string }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/media/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      media_id: parseInt(mediaId),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update like status");
  }

  const data: TLikeResponse = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to update like status");
  }

  return data;
};

export type TReview = {
  username: string;
  comment: string;
  created_at: string;
  rating: number;
};

export const getReviews = async ({ mediaId }: { mediaId: string }) => {
  const [reviewsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}/media/reviews/${mediaId}`),
  ]);

  if (!reviewsResponse.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const reviewsData = await reviewsResponse.json();

  if (reviewsData.status !== "success") {
    throw new Error("Failed to fetch reviews");
  }

  return reviewsData.reviews as TReview[];
};

export const getUserRating = async ({ mediaId }: { mediaId: string }) => {
  const [ratingResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}/media/user-rating/${mediaId}`),
  ])

  if (!ratingResponse.ok) {
    throw new Error("Failed to fetch user rating");
  }

  const ratingData = await ratingResponse.json();

  if (ratingData.status !== "success") {
    throw new Error("failde to fetch user rating");
  }

  return ratingData.rating as number;
}

export type TUpdateReviewArgs = {
  mediaId: string;
  comment: string;
  rating?: number;
};

export const updateReview = async ({
  mediaId,
  comment,
  rating = 5,
}: TUpdateReviewArgs) => {
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
    throw new Error("Failed to update review");
  }

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to update review");
  }

  return data.review as TReview;
};

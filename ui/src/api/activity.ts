import { getAuthHeader } from "@/utils/authHeader";

export type TActivity = {
  id: number;
  userId: number;
  activityType: "follow" | "review" | "like_review" | "like_media";
  targetId: number;
  relatedId: number | null;
  content: string | null;
  createdAt: string;
};

export type TEnhancedActivity = {
  activity: TActivity;
  media: {
    id: number;
    title: string;
    thumbnail_url: string;
    rating: number;
  };
  user: {
    username: string;
    avatar_url: string;
    role: "admin" | "user";
  };
  review: {
    mediaId: number;
    rating: number;
    reviewText: string;
    created_at: string;
  };
  followee: {
    username: string;
    avatar_url: string;
    role: "admin" | "user";
  };
};

export const getPaginatedActivity = async (
  type: "global" | "following",
  page: number,
) => {
  const url =
    import.meta.env.VITE_API_URL +
    `/activity${type === "following" ? "/following" : ""}?page=${page}`;
  const response = await fetch(url, {
    headers: type === "following" ? getAuthHeader() : undefined,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }

  const data = await response.json();
  return data.activity as TEnhancedActivity[];
};

export const followUser = async (followeeId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/activity/follow",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ followeeId: followeeId }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to follow user");
  }
};

export type TUserRatedMedia = {
  id: number;
  title: string;
  thumbnail_url: string | null;
  rating: number | null;
  userRating: number;
};

export const getTopUserMedia = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/activity/top-user-media",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch top user media");
  }

  const data = await response.json();

  return data.media as TUserRatedMedia[];
};

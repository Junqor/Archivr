import { getAuthHeader } from "@/utils/authHeader";

export type TActivity = {
  id: number;
  userId: number;
  activityType: "follow" | "review" | "like_review" | "like_media" | "reply";
  targetId: number;
  relatedId: number | null;
  content: string | null;
  createdAt: string;
};

export type TEnhancedActivity = {
  activity: TActivity;
  media?: {
    title?: string;
    thumbnail_url?: string;
    rating?: number;
    release_date?: string;
    like_count?: number;
    userRating?: number | null;
    is_liked?: boolean;
  };
  user: {
    username: string;
    avatar_url: string;
    role?: "admin" | "user";
    display_name?: string;
    rating?: number;
  };
  review?: {
    created_at: string;
    review_likes: number;
  };
  followee?: {
    username: string;
    display_name?: string;
    avatar_url: string;
    role: string;
  };
  reply?: {
    user_id: number;
    username: string;
    avatar_url: string;
    role: string;
    display_name: string;
    rating: number;
  };
};

export const getPaginatedActivity = async (
  type: "global" | "following",
  limit = 15,
  offset = 0,
  userId?: number,
) => {
  let url = "";

  if (type === "global") {
    url = `${import.meta.env.VITE_API_URL}/activity/global?limit=${limit}&offset=${offset}`;
  } else if (type === "following") {
    if (!userId) {
      throw new Error("userId is required for following activity");
    }
    url = `${import.meta.env.VITE_API_URL}/activity/user/${userId}/following?limit=${limit}&offset=${offset}`;
  }

  const response = await fetch(url);

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
  likes: number;
  userRating: number;
  ratedAt?: string;
};

export const getTopUserMedia = async (limit = 10) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/activity/top-user-media?limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch top user media");
  }

  const data = await response.json();
  return data.media as TUserRatedMedia[];
};

export const getUserTopMedia = async (username: string, limit = 10) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/activity/user/${userId}/top-media?limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user top media");
  }

  const data = await response.json();
  return data.media as TUserRatedMedia[];
};

export const getUserActivity = async (
  username: string,
  type: "self" | "following",
  limit = 15,
  offset = 0,
) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const url = new URL(
    `${import.meta.env.VITE_API_URL}/activity/user/${userId}${type === "self" ? "" : `/following`}`,
  );
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  const result = await fetch(url.toString());

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.activity as TEnhancedActivity[];
};

import { TUserSettings } from "@/pages/settingsPage/settingsPage";
import { getAuthHeader } from "@/utils/authHeader";

export const searchUsers = async (
  query: string,
  limit: number,
  offset: number,
  sortBy: "username" | "followers",
  orderBy: "asc" | "desc",
) => {
  const url =
    import.meta.env.VITE_API_URL +
    "/search/users" +
    `?query=${query}&limit=${limit}&offset=${offset}&sortBy=${sortBy}&orderBy=${orderBy}`;
  const result = await fetch(url);
  if (!result.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await result.json();
  return data.data as {
    id: number;
    displayName: string | null;
    username: string;
    avatarUrl: string | null;
    followers: number;
    following: number;
    pronouns: string | null;
    reviews: number;
    likes: number;
  }[];
};

export const getUserSettings = async () => {
  try {
    const result = await fetch(
      import.meta.env.VITE_API_URL + "/user/settings",
      {
        method: "GET",
        headers: getAuthHeader(),
      },
    );
    const val = await result.json();
    return val.settings;
  } catch (error) {
    console.error(error);
  }
};

export const getUserSettingsForSettingsContext = async () => {
  try {
    const result = await fetch(
      import.meta.env.VITE_API_URL +
        "/user/get-user-settings-for-settings-context",
      {
        method: "GET",
        headers: getAuthHeader(),
      },
    );
    const val = await result.json();
    for (const key in val.settings) {
      if (key === "avatar_url") {
        val.settings["avatar_url"] =
          val.settings["avatar_url"] + `?${new Date().getTime()}`; // Force refresh of pfp image in memory
      }
    }
    return val.settings;
  } catch (error) {
    console.error(error);
  }
};

export type TUserProfile = {
  id: number;
  username: string;
  avatarUrl: string | null;
  displayName: string | null;
  tiktok: string | null;
  youtube: string | null;
  instagram: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  status: string | null;
};

export const getUserProfile = async (username: string) => {
  const result = await fetch(
    import.meta.env.VITE_API_URL + `/user/profile/${username}`,
  );
  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }
  const data = await result.json();
  return data.profile as TUserProfile;
};

export const setUserSettings = async (new_settings: TUserSettings) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/user/settings",
    {
      method: "POST",
      headers: { "content-type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(new_settings),
    },
  );
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message);
  }
};

export const uploadPfp = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(import.meta.env.VITE_API_URL + "/user/set-pfp", {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Failed to upload avatar");
  }
  return data.avatarUrl as string;
};

// Search for user(s) by name, username or id
export const searchUsersModPortal = async (
  query: string,
  limit: number = 5,
  offset: number = 0,
) => {
  if (!query) {
    return []; // Do not search if no query is provided
  }

  const url = import.meta.env.VITE_API_URL + "/search/users-mod-portal";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit, offset }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = (await response.json()) satisfies {
      status: string;
      users: TUserProfile[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch users");
    }

    return data.users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProfilePageData = async (username: string) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const result = await fetch(
    import.meta.env.VITE_API_URL + `/user/profile-page/${userId}`,
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.profilePage;
};

export const getProfileTabData = async (username: string) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const result = await fetch(
    import.meta.env.VITE_API_URL + `/user/profile-tab/${userId}`,
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.profileTab;
};

export const getUserFollows = async (
  username: string,
  type: "followers" | "following",
  extended?: boolean,
  limit?: number,
  offset?: number,
  sort_by?: string,
  sort_order?: string,
) => {
  const result = await fetch(
    import.meta.env.VITE_API_URL +
      `/user/${username}/${type}` +
      (extended ? "/extended" : "") +
      (limit || offset || sort_by || sort_order ? "?" : "") +
      (limit ? `limit=${limit}` : "") +
      (offset ? `&offset=${offset}` : "") +
      (sort_by ? `&sort_by=${sort_by}` : "") +
      (sort_order ? `&sort_order=${sort_order}` : ""),
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.follows;
};

export const addFavorite = async (mediaId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/user/add-favorite",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ mediaId }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add favorite");
  }

  const data = await response.json();

  return data;
};

export const removeFavorite = async (mediaId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/user/remove-favorite",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ mediaId: mediaId }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove favorite");
  }

  const data = await response.json();

  return data;
};

export const getFavorites = async (username: string) => {
  const result = await fetch(
    import.meta.env.VITE_API_URL + `/user/get-favorites/${username}`,
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.favorites;
};

export const checkFavorite = async (username: string, mediaId: number) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const result = await fetch(
    import.meta.env.VITE_API_URL + `/user/check-favorite/${userId}/${mediaId}`,
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.favorite;
};

import { TUserSettings } from "@/pages/settingsPage/settingsPage";
import { TUser } from "@/types/user";
import { getAuthHeader } from "@/utils/authHeader";

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
    return val.settings;
  } catch (error) {
    console.error(error);
  }
};

type TUserProfile = {
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
  try {
    await fetch(import.meta.env.VITE_API_URL + "/user/settings", {
      method: "POST",
      headers: { "content-type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(new_settings),
    });
    return;
  } catch (error) {
    console.error(error);
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
  if (!response.ok) {
    throw new Error("Failed to upload avatar");
  }
  const data = await response.json();
  return data.avatarUrl as string;
};

// Search for user(s) by name, username or id
export const searchUsers = async (
  query: string,
  limit: number = 5,
  offset: number = 1,
) => {
  if (!query) {
    return []; // Do not search if no query is provided
  }

  const url = import.meta.env.VITE_API_URL + "/search/users";

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
      users: TUser[];
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

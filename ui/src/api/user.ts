import { getAuthHeader } from "@/utils/authHeader";

export const getUserSettings = async () => {
  try {
    const result = await fetch(
      import.meta.env.VITE_API_URL + "/user/get-user-settings",
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

export const getUserProfileSettings = async (user_id: number) => {
  try {
    const result = await fetch(
      import.meta.env.VITE_API_URL +
        `/user/get-user-profile-settings/${user_id}`,
      {
        method: "GET",
      },
    );
    const val = await result.json();
    return val.settings;
  } catch (error) {
    console.error(error);
  }
};

export const setUserSettings = async (new_settings: Map<string, string>) => {
  try {
    await fetch(import.meta.env.VITE_API_URL + "/user/set-user-settings", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ settings: new_settings }, (_key, value) => {
        if (value instanceof Map) {
          return {
            dataType: "Map",
            value: Array.from(value.entries()),
          };
        } else {
          return value;
        }
      }),
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
};

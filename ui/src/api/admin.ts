import { TMedia } from "@/types/media";
import { getAuthHeader } from "@/utils/authHeader";

export const checkAuth = async () => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/auth", {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Auth failed");
  }
  return data.user;
};

export const deleteMedia = async (id: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/delete/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeader(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete media");
  }

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to delete media");
  }

  return data;
};

export const editMedia = async (id: number, newData: Partial<TMedia>) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id, newData }),
  });
  if (!response.ok) {
    throw new Error("Failed to edit media");
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to edit media");
  }
  return data;
};

export const addMedia = async (newData: Partial<TMedia>) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(newData),
  });

  if (!response.ok) {
    throw new Error("Failed to add media");
  }

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("Failed to add media");
  }

  return data;
};

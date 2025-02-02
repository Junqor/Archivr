import { getAuthHeader } from "@/utils/authHeader";

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

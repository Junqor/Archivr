import { TMedia } from "@/types/media";

export const getTopRated = async () => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/media/top");
  const data = await response.json();
  return data as TMedia[];
};

import { TMedia } from "@/types/media";
import { TGenre } from "@/types/genre";
import { getAuthHeader } from "@/utils/authHeader";

// Get 5 most popular media of a certain genre
export const getPopularMediaGenre = async (
  genre: string,
): Promise<TMedia[]> => {
  const url = import.meta.env.VITE_API_URL + "/genre/popular?genre=" + genre;

  try {
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch popular media");
    }

    const data = (await response.json()) as {
      status: string;
      popularMedia: TMedia[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch popular media");
    }

    return data.popularMedia;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Get 20 medias of a certain genre with offset, sortBy and order
export const getMediaGenre = async (
  genre: string,
  offset: number,
  sortBy: "alphabetical" | "release_date" | "rating",
  order: "asc" | "desc",
): Promise<TMedia[]> => {
  const url =
    import.meta.env.VITE_API_URL +
    `/genre/media?genre=${genre}&offset=${offset}&sortBy=${sortBy}&order=${order}`;

  try {
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const data = (await response.json()) as {
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

// Get a list of distinct genres
export const getGenres = async (): Promise<TGenre[]> => {
  const url = import.meta.env.VITE_API_URL + "/genre";

  try {
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    const data = (await response.json()) as {
      status: string;
      genres: TGenre[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch genres");
    }

    return data.genres;
  } catch (error) {
    console.error(error);
    return [];
  }
};

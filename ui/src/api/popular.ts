export const getPopularMovies = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + "/popular/movies",
  );
  const data = await response.json();
  return data.media;
};

export const getPopularShows = async () => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/popular/shows");
  const data = await response.json();
  return data.media;
};

export const getPopularAnime = async () => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/popular/anime");
  const data = await response.json();
  return data.media;
};

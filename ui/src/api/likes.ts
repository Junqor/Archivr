export const getUserLikes = async (
  username: string,
  limit?: number,
  offset?: number,
  sort_by?: string,
  sort_order?: string,
  ratingMax?: number,
  genre?: string,
) => {
  const userIdResponse = await fetch(
    import.meta.env.VITE_API_URL + `/user/${username}/id`,
  );

  if (!userIdResponse.ok) {
    throw { status: 404, message: "User not found" };
  }

  const { userId } = await userIdResponse.json();

  const result = await fetch(
    import.meta.env.VITE_API_URL +
      `/likes/user/${userId}` +
      (limit || offset || sort_by || sort_order || ratingMax || genre
        ? "?"
        : "") +
      (limit ? `limit=${limit}` : "") +
      (offset ? `&offset=${offset}` : "") +
      (sort_by ? `&sort_by=${sort_by}` : "") +
      (sort_order ? `&sort_order=${sort_order}` : "") +
      (ratingMax ? `&ratingMax=${ratingMax}` : "") +
      (genre ? `&genre=${genre}` : ""),
  );

  if (!result.ok) {
    throw { status: 404, message: "User not found" };
  }

  const data = await result.json();
  return data.data;
};

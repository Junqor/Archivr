export const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: "Bearer " + token,
  };
};

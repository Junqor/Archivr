export const getTvdbToken = async () => {
  try {
    const response = await fetch("https://api4.thetvdb.com/v4/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.TVDB_API_KEY,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result.data.token;
  } catch (error) {
    console.error("Failed to fetch TVDB token:", error);
    throw error;
  }
};

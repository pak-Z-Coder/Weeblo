"use server";

export const getScheduledAnimes = async (date) => {
  const controller = new AbortController();
  const signal = controller.signal;
  // from anify
  try {
    const resp = await fetch(
      `https://private-aniwatch-api.vercel.app/api/v2/hianime/schedule?date=${date}`,
      {
        next: {
          revalidate: 60 * 60 * 1,
        },
        signal,
      }
    );
    const data = await resp.json();
    return data.data.scheduledAnimes;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching data:", error);
    }
    return null;
  }
};

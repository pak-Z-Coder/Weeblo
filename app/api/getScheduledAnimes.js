"use server";
export const getScheduledAnimes = async () => {
  const controller = new AbortController();
  const signal = controller.signal;
  // from anify
  try {
    const resp = await fetch(
      `https://api.anify.tv/schedule?type=anime&fields=[id,title,coverImage]&apikey=`,
      {
        next: {
          revalidate: 60 * 60 * 1,
        },
        signal,
      }
    );
    const data = await resp.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching data:", error);
    }
    return null;
  }
};

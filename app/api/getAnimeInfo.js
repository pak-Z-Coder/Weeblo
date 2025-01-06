"use server";

import { filterAnimes } from "../filterAnimes";

export const getAnimeInfo = async (id) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/anime/${id}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
        signal,
      }
    );
    const data = await resp.json();
    if (data.relatedAnimes)
      await filterAnimes(data.data.relatedAnimes).then(
        (res) => (data.data.relatedAnimes = res)
      );
    return data.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching data:", error);
    }
    return null;
  }
};

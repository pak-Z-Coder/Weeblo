"use server";

import { filterAnimes } from "../filterAnimes";

export const getAnimeInfo = async (id) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const resp = await fetch(
      `https://private-aniwatch-api.vercel.app/anime/info?id=${id}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
        signal,
      }
    );
    const data = await resp.json();
    if (data.relatedAnimes)
      await filterAnimes(data.relatedAnimes).then(
        (res) => (data.relatedAnimes = res)
      );
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

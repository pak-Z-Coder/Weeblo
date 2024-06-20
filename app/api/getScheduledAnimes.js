"use server";

import { date } from "zod";

export const getScheduledAnimes = async (date) => {
  const controller = new AbortController();
  const signal = controller.signal;
  // from anify
  try {
    const resp = await fetch(
      `https://private-aniwatch-api.vercel.app/anime/schedule?date=${date}`,
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

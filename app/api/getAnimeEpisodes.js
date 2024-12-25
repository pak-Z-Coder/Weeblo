"use server";
export const getAnimeEpisodes = async (id) => {
  const resp = await fetch(
    `https://private-aniwatch-api.vercel.app/api/v2/hianime/anime/${id}/episodes`,
    {
      next: {
        revalidate: 60 * 60 * 1,
      },
    }
  );
  const data = await resp.json();
  return data.data;
};

"use server";
export const getAnimeEpisodes = async (id) => {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/anime/${id}/episodes`,
    {
      next: {
        revalidate: 60 * 60 * 1,
      },
    }
  );
  const data = await resp.json();
  return data.data;
};

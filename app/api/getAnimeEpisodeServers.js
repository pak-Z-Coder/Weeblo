"use server";

export const getAnimeEpisodeServers = async (epId) => {
  const resp = await fetch(
    `https://private-aniwatch-api.vercel.app/api/v2/hianime/episode/servers?animeEpisodeId=${epId}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const data = await resp.json();
  return data.data;
};
export const getAnimeEpisodeServerLink = async (
  epId,
  server = "hd-1",
  category = "sub"
) => {
  const resp = await fetch(
    `https://private-aniwatch-api.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const data = await resp.json();

  return data.data;
};

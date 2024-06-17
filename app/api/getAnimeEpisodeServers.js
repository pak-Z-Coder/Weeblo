"use server";

export const getAnimeEpisodeServers = async (epId) => {
  const resp = await fetch(
    `https://private-aniwatch-api.vercel.app/anime/servers?episodeId=${epId}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const data = await resp.json();
  return data;
};
export const getAnimeEpisodeServerLink = async (
  epId,
  server = "vidstreaming",
  category = "sub"
) => {
  if (server == "hd-1") {
    server = "vidstreaming";
  } else if (server == "hd-2") {
    server = "vidcloud";
  }
  const resp = await fetch(
    `https://private-aniwatch-api.vercel.app/anime/episode-srcs?id=${epId}&server=${server}&category=${category}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const data = await resp.json();
  return data;
};

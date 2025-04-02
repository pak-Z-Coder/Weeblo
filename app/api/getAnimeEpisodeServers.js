"use server";

export const getAnimeEpisodeServers = async (epId) => {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/servers?animeEpisodeId=${epId}`,
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
  server = "hd-2",
  category = "sub"
) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );
    const data = await resp.json();
  
    return data.data;
  } catch (error) {
    server="hd-1"
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );
    const data = await resp.json();
  
    return data.data;
  }
 
};

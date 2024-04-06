"use server"
export const getPopularAnime = async () => {
    
    const resp = await fetch(
      `https://kitsu.io/api/edge/trending/anime`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );
    const data = await resp.json();
    return data.data;
  };
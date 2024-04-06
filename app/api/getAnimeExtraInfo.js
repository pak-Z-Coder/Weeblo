"use server";
export const getAnimeExtraInfo = async (name, JName) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const resp = await fetch(
      `https://kitsu.io/api/edge//anime?filter[text]=${name}`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": " application/vnd.api+json",
        },
        next: {
          revalidate: 60 * 60 * 24,
        },
        signal,
      }
    );
    const data = await resp.json();
    const filterdAnime = data.data.filter(
      (anime) =>
        anime.attributes.canonicalTitle == name ||
        anime.attributes.titles.en == name ||
        anime.attributes.titles.ja_jp == JName
    )[0];
    let useableData = {
      popularityRank: filterdAnime?.attributes.popularityRank,
      ratingRank: filterdAnime?.attributes.ratingRank,
      description: filterdAnime?.attributes.description,
      coverImage: filterdAnime?.attributes.coverImage?.original,
      posterImage: filterdAnime?.attributes.posterImage?.small,
      episodeLength: filterdAnime?.attributes.episodeLength,
      startDate: filterdAnime?.attributes.startDate,
      youtubeVideoId: filterdAnime?.attributes.youtubeVideoId,
      favoritesCount: filterdAnime?.attributes.favoritesCount,
      userCount: filterdAnime?.attributes.userCount,
      totalLength: filterdAnime?.attributes.totalLength,
      nsfw: filterdAnime?.attributes.nsfw,
      episodes: filterdAnime?.relationships.episodes?.links.self,
    };
    return useableData;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching data:", error);
    }
    return null;
  }
};

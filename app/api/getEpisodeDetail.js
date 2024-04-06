"use server";

export const getEpisodeDetail = async (id) => {
  const resp = await fetch(`https://kitsu.io/api/edge/episodes/${id}`, {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": " application/vnd.api+json",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  });
  const data = await resp.json();
  let useableData = {
    description: data?.data.attributes.description,
    airdate: data?.data.attributes.airdate,
    length: data?.data.attributes.length,
    thumbnail: data?.data.attributes.thumbnail?.original,
    canonicalTitle: data?.data.attributes.canonicalTitle,
  };
  return useableData;
};

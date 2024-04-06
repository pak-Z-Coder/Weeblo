"use server";

export const filterAnimes = async (animes) => {
  let filteredAnimes = [];
  filteredAnimes = await animes?.filter((item, index) => {
    return animes.findIndex((obj) => obj.id === item.id) === index;
  });
  return filteredAnimes;
};

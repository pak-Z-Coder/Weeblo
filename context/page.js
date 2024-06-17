"use client";
import { filterAnimes } from "@/app/filterAnimes";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [homeScreenData, setHomeScreenData] = useState({});
  const [user, setUser] = useState(null);
  const fetchHomeScreenData = async () => {
    const resp = await fetch("https://private-aniwatch-api.vercel.app/anime/home", {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });
    const data = await resp.json();
    if (data.topAiringAnimes)
      await filterAnimes(data.topAiringAnimes).then(
        (res) => (data.topAiringAnimes = res)
      );

    setHomeScreenData(data);
  };
  useEffect(() => {
    fetchHomeScreenData();
  }, [setHomeScreenData]);

  return (
    <AppContext.Provider
      value={{
        ...homeScreenData,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

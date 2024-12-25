"use client";
import { filterAnimes } from "@/app/filterAnimes";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [homeScreenData, setHomeScreenData] = useState({});
  const [user, setUser] = useState(null);
  const fetchHomeScreenData = async () => {
    const resp = await fetch("https://private-aniwatch-api.vercel.app/api/v2/hianime/home", {
      headers:{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":"*"
      },
      next: {
        revalidate: 60 * 60 * 24,
      },
    });
    const data = await resp.json();
    if (data.topAiringAnimes)
      await filterAnimes(data.data.topAiringAnimes).then(
        (res) => (data.data.topAiringAnimes = res)
      );

    setHomeScreenData(data.data);
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

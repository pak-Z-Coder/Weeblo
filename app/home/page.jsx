"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/page";
const AnimesCarousel = React.lazy(() => import('@/components/AnimesCarousel'));
const CarouselBanner = React.lazy(() => import('@/components/CarouselBanner'));
const AnimeVerticalCarousel = React.lazy(() => import('@/components/AnimeVerticalCarousel'));
const AnimeGrid = React.lazy(() => import('@/components/AnimeGrid'));
const ScrollTopButton = React.lazy(() => import('@/components/ScrollTopButton'));
export default function Home() {
  let {
    spotlightAnimes,
    trendingAnimes,
    latestEpisodeAnimes,
    topUpcomingAnimes,
    top10Animes,
    topAiringAnimes, user
  } = useAppContext();
  const [topTypeValue, setTopTypeValue] = useState("week");
  return (
    <main className="relative flex flex-col overflow-x-hidden w-screen no-scrollbar">
      <CarouselBanner animes={spotlightAnimes} />
      <div className="grid grid-cols-1 grid-rows-3 sm:min-h-screen">
        <AnimesCarousel
          animes={top10Animes && top10Animes[topTypeValue]}
          type="Top 10"
          topTypeValue={topTypeValue}
          setTopTypeValue={setTopTypeValue}
        />
        <AnimesCarousel animes={trendingAnimes} type="Trending" />
        <AnimesCarousel animes={topAiringAnimes} type="Top Airing" />
        {user &&
          <AnimesCarousel animes={user?.continueWatching} type="Continue Watching" />
        }
      </div>
      <div className="px-2 md:space-x-2 grid grid-cols-1 mt-10 sm:mt-16 lg:grid-cols-4 items-start">
        <div className="lg:border-r">
          <AnimeVerticalCarousel animes={topUpcomingAnimes} type={"Upcoming"} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 md:h-[75vh] overflow-y-scroll no-scrollbar">
          <AnimeGrid animes={latestEpisodeAnimes} type={"Latest Episodes"} />
        </div>
      </div>
      <ScrollTopButton />
    </main>
  );
}

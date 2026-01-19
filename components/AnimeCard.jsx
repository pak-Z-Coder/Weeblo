import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { getAnimeInfo } from "@/app/api/getAnimeInfo";
import MiniInfoCard from "./MiniInfoCard";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AnimeCard = ({ anime, type }) => {
  const { rank, name, id, poster } = anime;
  const [animeInfo, setAnimeInfo] = useState(null);
  const [fetchLoading, setfetchLoading] = useState(null);
  let hoverTimeOut;
  const handleHover = () => {
    if (type != "season") {
      clearTimeout(hoverTimeOut);
      hoverTimeOut = setTimeout(async () => {
        setfetchLoading(true);
        await getAnimeInfo(anime.id).then((res) => setAnimeInfo(res));
        setfetchLoading(false);
      }, 1400);
    }
  };
  return (
    <HoverCard className="w-full">
      <HoverCardTrigger className="w-full z-0">
        <Link
          href={
            type != "Latest Episodes"
              ? `/animeInfo/${encodeURIComponent(id)}`
              : `/watch/${encodeURIComponent(id)}?ep=${anime.episodes.sub}`
          }
          className="w-full block">
          <div
            onMouseEnter={handleHover}
            className="group rounded-lg w-full cursor-pointer transition-all transform md:hover:scale-[0.97] ease-in-out duration-300 hover:drop-shadow-xl flex items-center justify-center relative overflow-hidden aspect-[2/3]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-950/80 group-hover:via-gray-900/50 group-hover:to-gray-950/95 z-20 transition-all duration-300"></div>
            {type == "season" && (
              <div className="absolute inset-0 group-hover:backdrop-blur-0 backdrop-blur-sm z-10 transition-all duration-300"></div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end items-center z-20 text-white font-semibold">
              {type == "Latest Episodes" && (
                <div className="sm:text-lg text-white absolute top-1 left-2 font-semibold z-30 textStroke">
                  EP{anime.episodes.sub}
                </div>
              )}
              {type == "Top 10" && (
                <p className="md:text-lg rounded-br-lg text-sm px-1 sm:px-2 bg-secondary/80 absolute top-0 left-0 z-30">
                  {rank}
                </p>
              )}
              {!fetchLoading && animeInfo && type !== "season" ? (
                <div className="opacity-0 sm:group-hover:opacity-100 space-x-1 absolute top-3 right-1 sm:right-3 z-30">
                  <Badge
                    variant="outline"
                    className="bg-secondary bg-opacity-90 sm:text-sm text-white border-none">
                    {animeInfo?.anime?.info?.stats?.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white bg-opacity-90 sm:text-sm text-black border-none">
                    {animeInfo?.anime?.info?.stats?.quality}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/50 sm:text-sm text-black border-none">
                    {animeInfo?.anime?.info?.stats?.duration}
                  </Badge>
                </div>
              ) : (
                <></>
              )}
              <p
                className={cn(
                  "z-20 text-xs line-clamp-2 px-2",
                  type == "season"
                    ? "text-left w-full bottom-2 sm:bottom-3"
                    : type == "Top Airing"
                    ? "md:text-sm text-center w-full max-w-full max-h-[80%] overflow-hidden mb-2 sm:mb-4"
                    : "md:text-lg text-center w-full max-w-full max-h-[80%] overflow-hidden mb-2 sm:mb-4"
                )}>
                {name}
              </p>
            </div>
            <img
              loading="lazy"
              key={id}
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500",
                type == "season"
                  ? "aspect-[100/200]"
                  : "aspect-[2/3] group-hover:scale-110"
              )}
              alt={name}
              title={name}
              src={poster || "/placeholder-cover.jpg"}
            />
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 min-w-80">
        {type != "season" && animeInfo && (
          <MiniInfoCard anime={animeInfo?.anime} type={type} />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default AnimeCard;

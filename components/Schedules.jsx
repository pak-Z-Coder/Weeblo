import React, { useEffect, useState } from "react";
import { getScheduledAnimes } from "@/app/api/getScheduledAnimes";
import {
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  Carousel,
} from "@/components/ui/carousel";
import ScheduledCard from "./ScheduledCard";
import Autoplay from "embla-carousel-autoplay";
import { Bakbak_One } from "next/font/google";
import { cn } from "@/lib/utils";
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const Schedules = () => {
  const [animes, setAnimes] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const getAnimes = async () => {
    await getScheduledAnimes(today).then((res) => {
      setAnimes(res);
    });
  };
  useEffect(() => {
    getAnimes();
  }, []);
  return (
    <div className="mt-4 mb-4 sm:mb-8">
      <div className="mb-2">
        <p
          className={cn(
            "text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl",
            bakbak_one.className
          )}>
          Today Schedules
        </p>
      </div>

      <Carousel
        className="w-[95%] sm:w-[90%] mx-auto "
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 4000 })]}>
        <CarouselContent className="">
          {animes &&
            animes.map((anime) => (
              <CarouselItem
                key={anime.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                <ScheduledCard anime={anime} />
              </CarouselItem>
            ))}
          {animes && animes.length == 0 && (
            <p className="mx-auto opacity-85 text-sm">No schedules</p>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Schedules;

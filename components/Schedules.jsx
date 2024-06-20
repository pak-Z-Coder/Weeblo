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
// import { Button } from "./ui/button";
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const Schedules = () => {
  const [animes, setAnimes] = useState(null);
  // const [days, setDays] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const getAnimes = async () => {
    await getScheduledAnimes(today).then((res) => {
      console.log(res);
      setAnimes(res);
    });
  };
  useEffect(() => {
    getAnimes();
  }, []);
  useEffect(() => {
    if (!animes) return;
    // setDays(Object.keys(animes));
    setSelectedDay(Object.keys(animes)[0]);
  }, [animes]);
  return (
    <div className="mt-4 mb-4 sm:mb-8">
      <div className="mb-2">
        <p
          className={cn(
            "text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl",
            bakbak_one.className
          )}
        >
          Scheduled
        </p>
      </div>
      {/*       
      <Carousel
        className="w-[70%] sm:w-[80%] md:w-[90%] mb-2 mx-auto "
        opts={{ align: "start" }}
      >
        <CarouselContent className="mx-auto">
          {days &&
            days.map((day) => (
              <CarouselItem
                key={day}
                className=" basis-1/2 sm:basis-1/4 md:basis-1/5 lg:basis-[14%]"
              >
                <Button
                  onClick={() => setSelectedDay(day)}
                  variant="primary"
                  className={cn(
                    "font-bold w-full tracking-wide",
                    selectedDay == day && "bg-primary"
                  )}
                >
                  <p className="mx-auto text-xs sm:text-sm">
                    {day[0].toUpperCase() + day.slice(1, day.length)}
                  </p>
                </Button>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="block md:hidden focus:bg-primary" />
        <CarouselNext className="block md:hidden focus:bg-primary" />
      </Carousel> */}

      <Carousel
        className="w-[95%] sm:w-[90%] mx-auto "
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 4000 })]}
      >
        <CarouselContent className="">
          {animes &&
            selectedDay &&
            animes[selectedDay].map((anime) => (
              <CarouselItem
                key={anime.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <ScheduledCard anime={anime} />
              </CarouselItem>
            ))}
          {animes && selectedDay && animes[selectedDay].length == 0 && (
            <p className="mx-auto opacity-85 text-sm">
              No schedules for {selectedDay}
            </p>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Schedules;

"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getCategoryResults,
  getGenreResults,
  getProducerResults,
  getSearchResults,
  getSearchSuggestions,
} from "@/app/api/getSearchResults";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const AnimeGrid = dynamic(() => import("@/components/AnimeGrid"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const AnimeVerticalCarousel = dynamic(
  () => import("@/components/AnimeVerticalCarousel"),
  {
    loading: () => (
      <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    ),
  }
);
const Pagination = dynamic(
  () => import("@/components/SearchPagination"),
  {
    loading: () => (
      <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    ),
  }
);
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, FilterX, Loader } from "lucide-react";
import { Bakbak_One } from "next/font/google";
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const SearchPage = ({ params: { term }, searchParams: { type } }) => {
  const [fetchLoading, setfetchLoading] = useState(null);
  const [fetchLoading2, setfetchLoading2] = useState(null);
  const [searchResults, setSearchResults] = useState({});
  const [filterdResults, setFilterdResults] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [durationFilter, setDurationFilter] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  if (!term) notFound();
  const termToUse = decodeURI(term);
  const fetchSearchResults = async () => {
    setfetchLoading(true);
    if (type == "genre") {
      await getGenreResults(termToUse.toLowerCase(), currentPage).then((res) =>
        setSearchResults(res)
      );
    } else if (type == "search") {
      await getSearchResults(termToUse.toLowerCase(), currentPage).then((res) =>
        setSearchResults(res)
      );
    } else if (type == "producer") {
      await getProducerResults(termToUse.replace(" ","-").toLocaleLowerCase(), currentPage).then(
        (res) => setSearchResults(res)
      );
    } else {
      await getCategoryResults(termToUse.toLowerCase(), currentPage).then(
        (res) => setSearchResults(res)
      );
    }
    setfetchLoading(false);
  };
  const fetchSearchSuggestions = async () => {
    setfetchLoading2(true);
    await getSearchSuggestions(termToUse.toLowerCase()).then((res) =>
      setSearchSuggestions(res)
    );
    setfetchLoading2(false);
  };
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchSearchResults();
  };
  useEffect(() => {
    fetchSearchResults();
    fetchSearchSuggestions();
  }, []);
  useEffect(() => {
    if (!typeFilter && !durationFilter) return;
    let filteredAnimeList = searchResults.animes;

    if (typeFilter) {
      filteredAnimeList = filteredAnimeList.filter(
        (anime) => anime.type === typeFilter
      );
    }

    if (durationFilter) {
      let durationTimeStart, durationTimeEnd;
      if (durationFilter !== "40+") {
        let filters = durationFilter.split("-");
        durationTimeStart = Number(filters[0]);
        durationTimeEnd = Number(filters[1]);
      } else {
        durationTimeStart = 40;
        durationTimeEnd = 200;
      }

      filteredAnimeList = filteredAnimeList.filter((anime) => {
        let duration = Number(anime.duration.split("m")[0]);
        return duration >= durationTimeStart && duration <= durationTimeEnd;
      });
    }

    setFilterdResults(filteredAnimeList);
  }, [typeFilter, durationFilter]);
  return (
    <div className="px-2 min-h-screen md:space-x-2 grid grid-cols-1 mt-16 lg:grid-cols-4 items-start">
      <div className={cn("col-span-1 h-full lg:col-span-3 py-2")}>
        <div className="flex items-center space-x-4">
          <p
            className={cn(
              "text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl select-none",
              bakbak_one.className
            )}>
            Results for{" "}
          </p>
          <p className="text-lg font-semibold">"{termToUse}"</p>
        </div>
        <div className="w-fit flex px-2 ml-auto mb-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none ">
              <div className="flex items-center text-xs sm:text-sm mr-5 text-secondary dark:text-white font-semibold">
                {typeFilter ? typeFilter : "Type"}
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className=" backdrop-blur-xl w-fit p-0 mr-5">
              <DropdownMenuItem
                className="cursor-pointer text-white ml-auto"
                onClick={() => setTypeFilter("TV")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  TV
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setTypeFilter("Movie")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  Movie
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setTypeFilter("Special")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  Special
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setTypeFilter("OVA")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  OVA
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setTypeFilter("ONA")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  ONA
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none ">
              <div className="flex items-center text-xs sm:text-sm mr-5 text-secondary dark:text-white font-semibold">
                {durationFilter ? durationFilter + " min" : "Duration"}
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="backdrop-blur-xl w-fit p-0 mr-5">
              <DropdownMenuItem
                className="cursor-pointer text-white ml-auto"
                onClick={() => setDurationFilter("0-10")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  0-10 min
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setDurationFilter("10-20")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  10-20 min
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setDurationFilter("20-30")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  20-30 min
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setDurationFilter("30-40")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  30-40 min
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer ml-auto text-white "
                onClick={() => setDurationFilter("40+")}>
                <Button variant="ghost" className="w-full text-xs sm:text-sm">
                  40+ min
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {
            <Button
              variant="outline"
              onClick={() => {
                setFilterdResults(null);
                setDurationFilter(null);
                setTypeFilter(null);
              }}
              className={cn(
                "w-fit border-none bg-inherit ",
                filterdResults && "bg-primary/90 hover:bg-primary"
              )}>
              <FilterX className="w-5" />
            </Button>
          }
        </div>
        <div
          className={cn(
            "min-h-[80%] sm:max-h-[110vh] border lg:border-r p-1 mb-1 overflow-y-scroll no-scrollbar",
            (type == "genre" || type == "category") && "md:h-screen"
          )}>
          <AnimeGrid
            animes={filterdResults ? filterdResults : searchResults?.animes}
            type={""}
          />
        </div>
        {searchResults && !filterdResults && (
          <Pagination
            currentPage={currentPage}
            totalPages={searchResults.totalPages}
            hasNextPage={searchResults.hasNextPage}
            fetchLoading={fetchLoading}
            handlePagination={handlePagination}
          />
        )}
      </div>
      <div className="flex flex-col md:space-y-20 mt-10 sm:mt-20 lg:mt-10">
        <div className="border">
          {!fetchLoading && (type == "genre" || type == "producer") && (
            <AnimeVerticalCarousel
              animes={searchResults?.topAiringAnimes}
              type={"Top Airing"}
            />
          )}
          {!fetchLoading && type == "search" && (
            <AnimeVerticalCarousel
              animes={searchResults?.mostPopularAnimes}
              type={"Popular"}
            />
          )}
        </div>
        <Separator />
        <div className="border">
          {!fetchLoading2 && type == "search" && (
            <AnimeVerticalCarousel
              animes={searchSuggestions?.suggestions}
              type={"Suggestions"}
            />
          )}
          {!fetchLoading && (type == "producer" || type == "category") && (
            <AnimeVerticalCarousel
              animes={searchResults?.top10Animes?.week}
              type={"Top 10"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

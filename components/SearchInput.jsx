"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Loader, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { getSearchSuggestions } from "@/app/api/getSearchResults";
import AnimeVerticalCarousel from "./AnimeVerticalCarousel";

const SearchInput = () => {
  const [fetchLoading, setfetchLoading] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState({});
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  let timeout;
  function onSubmit(values) {
    router.push(`/search/${values.searchPrompt}?type=search`);
  }
  const handleFetch = async (value) => {
    clearTimeout(timeout);
    timeout=setTimeout(async () => {
        console.log("triggerd")
      setfetchLoading(true);
      await getSearchSuggestions(value).then((res) =>
        setSearchSuggestions(res)
      );
      setfetchLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-white outline-none"
            size="icon">
            <Search />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 mr-4 relative right-2 sm:right-3 sm:pl-3 max-w-screen sm:min-w-80">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-around gap-1 sm:gap-2 focus:w-full sm:focus:shadow-md dark:sm:focus:shadow-blue-500">
            <Input
              autoComplete="off"
              onChangeCapture={(e) => handleFetch(e.currentTarget.value)}
              {...register("searchPrompt", { required: true })}
              className="ml-2 sm:ml-1 font-semibold bg-opacity-50 dark:bg-blue-950/50 border-none bg-slate-50 transition-all ease-linear focus:translate-x-[-6px] sm:focus:translate-x-[-10px] placeholder:text-slate-950  dark:placeholder:text-slate-400"
              placeholder="Search"
            />
            <Button
              type="submit"
              name="searchPrompt"
              className="sm:hidden px-3 py-1 w-14 text-white bg-violet-800 dark:bg-violet-950 rounded-sm">
              <p>Search</p>
            </Button>
          </form>
          {fetchLoading && (
            <Loader className="mx-auto mt-5 relative bottom-0 h-12 w-12 animate-spin text-primary" />
          )}
          {searchSuggestions?.suggestions && <DropdownMenuSeparator />}
          {!fetchLoading && (
            <AnimeVerticalCarousel
              animes={searchSuggestions?.suggestions}
              type={"suggestions"}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchInput;

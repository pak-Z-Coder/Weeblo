"use client";
import { useAppContext } from "@/context/page";
import Image from "next/image";
import Link from "next/link";
import banner from "../public/images/banner.png";
import { PlayCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import LoginSignUpCard from "@/components/LoginSignUpCard";

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  let { spotlightAnimes } = useAppContext();
  function onSubmit(values) {
    router.push(`/search/${values.searchPrompt}?type=search`);
  }
  return (
    <main className="flex -mb-5 md:-mb-12 px-2 md:px-0 flex-col overflow-x-hidden w-screen no-scrollbar">
      <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] ">
            <Image
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              src={banner}
            />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl text-primary font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Unlimited Movies, TV shows, and more.
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Watch anywhere,Save for Later,Enjoy anytime.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="flex max-w-lg space-x-2">
                  <Input
                    autoComplete="off"
                    className="flex-1 bg-primary/20 placeholder:font-semibold font-semibold text-lg focus-visible:ring-0"
                    placeholder="Search"
                    type="search"
                    {...register("searchPrompt", { required: true })}
                  />
                  <Button
                    className="h-10 w-10 p-2 bg-secondary"
                    variant="outline"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </form>
              <div className="flex flex-col min-[580px]:w-[90%] sm:w-[60%] gap-2 md:w-[50%] lg:w-[45%]">
                <Link
                  className="inline-flex space-x-2 h-9 items-center justify-center rounded-md bg-secondary px-8 items-centerfont-medium text-gray-50 shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  href="/home"
                >
                  <PlayCircle /> <span> Watch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-background">
        {spotlightAnimes && (
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl text-primary font-bold tracking-tighter md:text-4xl/tight">
                Popular Shows
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The hottest animes streaming now.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-4 sm:gap-6 lg:grid-cols-2 xl:gap-8">
              {spotlightAnimes.slice(0, 6).map((anime) => (
                <div key={anime.id} className="flex flex-col gap-2">
                  <Link
                    className="group grid grid-cols-2 overflow-hidden"
                    href={`/animeInfo/${encodeURIComponent(anime?.id)}`}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-l from-gray-50/0 via-gray-900/10 to-black z-20"></div>
                      <Image
                        alt="Cover"
                        className="aspect-video w-44 h-20 object-cover object-center rounded-t-lg hover:opacity-75 transition-opacity group-hover:opacity-75"
                        src={anime.poster}
                        width={1366}
                        height={78}
                      />
                    </div>
                    <div className="grid gap-1 p-2">
                      <h3 className="text-sm font-medium text-secondary leading-none">
                        {anime.rank} · {anime.name}
                      </h3>
                      <p className="text-sm leading-none text-gray-500 underline-offset-4 dark:text-gray-400">
                        {anime.otherInfo[2]}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-background">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Experience the lastest fetaures
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Lets create an account for free.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex justify-end">
                <Button className="inline-flex h-10 items-center justify-center rounded-tl-md rounded-bl-md bg-primary px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Get Account
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm sm:max-w-md">
              <LoginSignUpCard />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}

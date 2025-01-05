"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import titlePng from "../public/images/title.png";
import logoPng from "../public/images/logo.png";

import SearchInput from "./SearchInput";
import GenreDropDown from "./GenreDropDown";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/page";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LoginSignUpCard from "./LoginSignUpCard";

const Header = () => {
  let { user, setUser } = useAppContext();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHiddenRoute = pathname == "/";
  const getUser = async () => {
    if (typeof window == "undefined") return;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const userData = JSON.parse(storedUser);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.user }),
      });
      const data = await response.json();
      if (data.status != 201) {
        throw new Error(data.body.message);
      } else {
        setUser(data.body.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 50) {
        // Change 50 to whatever scroll position you desire
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (user) return;
    getUser();
  }, []);
  return (
    !isHiddenRoute && (
      <div
        className={cn(
          "fixed w-screen overflow-x-hidden overflow-y-hidden no-scrollbar top-0 z-30 flex items-center justify-between px-2 md:px-5 h-12 sm:h-16 bg-gradient-to-t from-primary/0 via-[#100b25]/15 to-[#100b25]/40",
          scrolled && "backdrop-blur-sm"
        )}>
        <div name="left" className="h-full">
          <div className="flex h-full items-center">
            <Link href="/">
              <Image
                alt="logo"
                className="w-10 h-10 hidden sm:block"
                src={logoPng}
              />
            </Link>
            <Link href="/home">
              <Image
                alt="title"
                className="w-28 md:w-32 drop-shadow-md md:drop-shadow-lg"
                src={titlePng}
              />
            </Link>
          </div>
        </div>
        <div
          name="right"
          className="sm:w-[50%] justify-end flex items-center gap-1 sm:gap-2">
          <div name="movies" title="movies" className="mr-1 flex focus:outline-none text-sm sm:text-[16px] text-white font-semibold">
            <Link href={`/search/movie?type=category`} className="w-full flex items-center">
              <Button 
                variant="ghost"
                type="submit"
                value={"movie"}
                className="px-1 text-xs font-semibold sm:text-sm w-full text-white hover:text-white sm:px-2 dark:hover:bg-primary/10 hover:bg-primary/20">
                Movies
              </Button>
            </Link>
          </div>
          <div name="genre" className="sm:w-[40%] w-fit">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <GenreDropDown />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search by genre</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div name="searchBar" className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SearchInput />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search Anime</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {user && (
            <div name="profileImg" className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="">
                        <Avatar className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer ring-1 ring-offset-1 ring-offset-transparent hover:ring-primary">
                          <AvatarImage
                            alt={user?.username[0]}
                            src="https://zz.com/shadcn.png"
                          />
                          <AvatarFallback>{user?.username[0]}</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-fit mr-2 p-0 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer font-semibold">
                          {user && (
                            <Link href="/user">
                              <Button
                                variant="ghost"
                                className="w-full flex items-center space-x-2">
                                <p>Account</p>
                                <User className="max-w-6" />
                              </Button>
                            </Link>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer font-semibold flex items-center"
                          onClick={() => {
                            localStorage.removeItem("user");
                            setUser(null);
                          }}>
                          {user && (
                            <Link
                              href={
                                pathname == "/user" ? "/home" : window.location
                              }>
                              <Button
                                variant="ghost"
                                className="w-full flex items-center justify-between space-x-2">
                                <p>Log out</p>
                                <LogOut className="max-w-6" />
                              </Button>
                            </Link>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {!user && (
            <div>
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    className="w-fit flex items-center justify-between sm:space-x-2 py-0 text-white">
                    <p className="hidden sm:inline-block">Log In</p>
                    <User className="border border-white rounded-full max-w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md">
                  <div>
                    <LoginSignUpCard />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Header;

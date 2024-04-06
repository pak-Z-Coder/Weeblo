"use client"
import { useEffect, useRef, useState } from 'react'
import AnimeCard from './AnimeCard';
import { Loader, ChevronsRight, ChevronsLeft, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'
import { Bakbak_One } from 'next/font/google'
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CustomAnimeCard from './CustomAnimeCard';
const bakbak_one = Bakbak_One({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const AnimesCarousel = ({ animes, type, setTopTypeValue, topTypeValue }) => {
    const containerRef = useRef(null);
    const [hover, setHover] = useState(false);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    useEffect(() => {
        const container = containerRef?.current;
        if (container) {
            const isOverflowing = container.scrollWidth > container.clientWidth;
            setShowScrollButtons(isOverflowing);
        }
    }, [animes]);
    const scrollLeft = () => {
        containerRef.current.scrollTo({
            left: containerRef.current.scrollLeft - containerRef.current.offsetWidth,
            behavior: 'smooth', // Enable smooth scrolling
        });
    };
    const scrollRight = () => {
        containerRef.current.scrollTo({
            left: containerRef.current.scrollLeft + containerRef.current.offsetWidth,
            behavior: 'smooth', // Enable smooth scrolling
        });
    };
    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='overflow-hidden relative'>
            <div className='flex items-center justify-between  space-x-2'>
                <p className={cn('text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl', bakbak_one.className)}>{animes?.length != 0 && type}</p>
                {type == "Top 10" && <DropdownMenu >
                    <DropdownMenuTrigger className='focus:outline-none '>
                        <div className='flex items-center text-xs mr-5 text-secondary dark:text-white font-semibold'>
                            <ChevronDown />
                            {topTypeValue.charAt(0).toUpperCase() + topTypeValue.slice(1)}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="backdrop-blur-xl w-fit p-0 mr-5">
                        <DropdownMenuItem className="cursor-pointer text-white font-semibold ml-auto" onClick={() => setTopTypeValue("today")}>
                            <Button variant="ghost" className="w-full">
                                Today
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer ml-auto text-white font-semibold" onClick={() => setTopTypeValue("week")}>
                            <Button variant="ghost" className="w-full">
                                Week
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer ml-auto text-white font-semibold" onClick={() => setTopTypeValue("month")}>
                            <Button variant="ghost" className="w-full">
                                Month
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>
            {!animes ?
                <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
                :
                <div className='flex-shrink sm:pl-1 pb-1 overflow-hidden flex overflow-x-scroll no-scrollbar sm:gap-1' ref={containerRef}>
                    {
                        animes?.map((anime) => type != "Continue Watching" ? <AnimeCard className="carousel-item" key={anime.id} anime={anime} type={type == "Seasons" ? "season" : type} /> : <CustomAnimeCard anime={anime} key={anime.animeId} />)
                    }
                </div>
            }
            {showScrollButtons &&
                <Button variant="" onClick={scrollLeft} className={cn("text-white opacity-0 hidden md:block  absolute bg-transparent hover:bg-primary/20 left-0 top-1/3 px-0 h-fit", type == "Seasons" && "top-1/4 hover:bg-primary/0", hover && "md:opacity-50 md:hover:opacity-100")}><ChevronsLeft className={cn('w-28 h-28', type == "Seasons" && " w-20 h-20")} /></Button>
            }
            {showScrollButtons &&
                <Button variant="" onClick={scrollRight} className={cn("text-white opacity-0 hidden md:block  absolute bg-transparent hover:bg-primary/20  right-0 top-1/3 px-0 h-fit ", type == "Seasons" && "top-1/4 hover:bg-primary/0", hover && "md:opacity-50 md:hover:opacity-100")}><ChevronsRight className={cn('w-28 h-28', type == "Seasons" && " w-20 h-20")} /></Button>
            }
        </div>
    )
}

export default AnimesCarousel
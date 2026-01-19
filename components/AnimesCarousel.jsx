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
    
    const checkOverflow = () => {
        const container = containerRef?.current;
        if (container) {
            const isOverflowing = container.scrollWidth > container.clientWidth;
            setShowScrollButtons(isOverflowing);
        }
    };
    
    useEffect(() => {
        // Initial check
        const timeoutId = setTimeout(() => {
            checkOverflow();
        }, 100);
        
        // Check again after images load
        const images = containerRef.current?.querySelectorAll('img');
        let handleImageLoad;
        
        if (images && images.length > 0) {
            let loadedCount = 0;
            const totalImages = images.length;
            
            handleImageLoad = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    // All images loaded, check overflow
                    setTimeout(checkOverflow, 100);
                }
            };
            
            images.forEach((img) => {
                if (img.complete) {
                    handleImageLoad();
                } else {
                    img.addEventListener('load', handleImageLoad);
                    img.addEventListener('error', handleImageLoad);
                }
            });
        }
        
        // Use ResizeObserver to check overflow when container size changes
        const resizeObserver = new ResizeObserver(() => {
            setTimeout(checkOverflow, 50);
        });
        
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        // Also listen to window resize
        const handleResize = () => {
            setTimeout(checkOverflow, 100);
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            if (images && handleImageLoad) {
                images.forEach((img) => {
                    img.removeEventListener('load', handleImageLoad);
                    img.removeEventListener('error', handleImageLoad);
                });
            }
        };
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
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='overflow-hidden relative min-h-[120px]'>
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
                        animes?.map((anime) => type != "Continue Watching" ? (
                            <div 
                                key={anime.id} 
                                className={cn(
                                    "flex-shrink-0",
                                    type == "Top Airing"
                                        ? "w-[80px] sm:w-[120px] md:w-[140px] lg:w-[160px]"
                                        : "w-[90px] sm:w-[140px] md:w-[160px] lg:w-[180px]"
                                )}
                            >
                                <AnimeCard className="carousel-item" anime={anime} type={type == "Seasons" ? "season" : type} />
                            </div>
                        ) : (
                            <div key={anime.animeId} className="flex-shrink-0 w-[90px] sm:w-[140px] md:w-[160px] lg:w-[180px]">
                                <CustomAnimeCard anime={anime} />
                            </div>
                        ))
                    }
                </div>
            }
            {showScrollButtons && (
                <>
                    <Button 
                        variant="" 
                        onClick={scrollLeft} 
                        className={cn(
                            "z-10 text-white absolute bg-transparent hover:bg-primary/20 left-0 top-1/3 px-0 h-fit transition-opacity duration-300",
                            type == "Seasons" && "top-1/4 hover:bg-primary/0",
                            "hidden md:block",
                            hover ? "opacity-50 hover:opacity-90" : "opacity-0"
                        )}
                    >
                        <ChevronsLeft className={cn('w-28 h-28', type == "Seasons" && " w-20 h-20")} />
                    </Button>
                    <Button 
                        variant="" 
                        onClick={scrollRight} 
                        className={cn(
                            "z-10 text-white absolute bg-transparent hover:bg-primary/20 right-0 top-1/3 px-0 h-fit transition-opacity duration-300",
                            type == "Seasons" && "top-1/4 hover:bg-primary/0",
                            "hidden md:block",
                            hover ? "opacity-50 hover:opacity-90" : "opacity-0"
                        )}
                    >
                        <ChevronsRight className={cn('w-28 h-28', type == "Seasons" && " w-20 h-20")} />
                    </Button>
                </>
            )}
        </div>
    )
}

export default AnimesCarousel
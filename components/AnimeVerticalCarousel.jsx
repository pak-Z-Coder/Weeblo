import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Bakbak_One } from 'next/font/google'
import { cn } from '@/lib/utils'
import AnimeHorizontalCard from './AnimeHorizontalCard'
import Autoplay from 'embla-carousel-autoplay'
import { Loader } from 'lucide-react'


const bakbak_one = Bakbak_One({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const AnimeVerticalCarousel = ({ animes, type, page }) => {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            plugins={[
                Autoplay({
                    delay: type != "suggestions" ? 4000 : 5000,
                }),
            ]}
            orientation="vertical"
            className={cn("w-full border-none", page == "info" && "md:mt-20")}
        >
            {type != "suggestions" && <p className={cn("text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl select-none", bakbak_one.className)}>{type}</p>}
            <CarouselContent className={cn("max-h-[20vh] md:min-h-fit md:max-h-[70vh] z-0",type == "suggestions"&&"md:max-h-[55vh] min-w-40")}>
                {!animes && type != "suggestions" &&
                    <Loader className="mx-auto mt-5 relative bottom-0 h-6 w-6 animate-spin text-primary" />}
                {animes?.map((anime) => (
                    <CarouselItem key={anime.id} className="basis-1 min-h-[9.4rem] z-0">
                        <AnimeHorizontalCard anime={anime} type={type == "suggestions"?"suggestion":""}/>
                    </CarouselItem>
                ))}
            </CarouselContent >
            {type != "suggestions" && <CarouselPrevious />}
            {type != "suggestions" && <CarouselNext />}
        </Carousel>
    )
}

export default AnimeVerticalCarousel
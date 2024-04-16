"use client"
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Bebas_Neue } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import Link from 'next/link'
import { ArrowRight } from "lucide-react"
const bebas_nueue = Bebas_Neue({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const CarouselBanner = ({ animes }) => {
    Autoplay.globalOptions = {
        delay: 6000
    }

    const [emblaRef] = useEmblaCarousel({ loop: true, duration: 50 }, [Autoplay()])
    return (
        <div ref={emblaRef} className='overflow-hidden relative group'>
            <div className='flex cursor-grab min-h-[15rem] h-[15rem] sm:h-[18rem] md:h-[25rem] lg:h-[30rem]'>
                {
                    animes?.map((anime) => (
                        <div className='flex-full min-w-0 relative' key={anime.id}>
                            <img alt='Banner' width={"1366"} height={"768"} className='object-cover ml-auto min-h-[14rem] h-[14rem] lg:h-[32rem] lg:w-[75rem]' src={anime?.poster} />
                            <div className='absolute inset-0 bg-gradient-to-bl from-primary/10 via-gray-900/10 to-gray-950 hover:to-black z-20'></div>
                            <div className='absolute hidden dark:block inset-0 bg-gradient-to-br from-primary/10 via-gray-900/10 to-gray-950 hover:to-black z-20'></div>
                            <div className='absolute inset-0 bg-gradient-to-l from-gray-50/0 via-gray-900/10 to-black z-20'></div>
                            <div className='absolute inset-0 bg-gradient-to-l from-gray-50/0 via-gray-900/10 to-black z-20'></div>
                            <div className='absolute hidden sm:block inset-0 bg-gradient-to-l from-gray-50/0 via-gray-900/0 to-black z-20'></div>
                            <div className='absolute z-20 bottom-10 sm:bottom-[2rem] md:bottom-[5rem] left-5 min-w-[60%] sm:min-w-[40%] sm:max-w-[40%] max-w-[60%] sm:w-fit'>
                                <div className="space-x-1 mb-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <Badge variant="outline" className="bg-secondary bg-opacity-50 sm:text-sm text-white border-none">{anime?.otherInfo[0]}</Badge>
                                    <Badge variant="outline" className="bg-white bg-opacity-70 backdrop-blur-sm  sm:text-sm text-black border-none">{anime?.otherInfo[1]}</Badge>
                                    <Badge variant="outline" className="bg-opacity-20 text-white backdrop-blur-sm sm:text-sm ">{anime?.otherInfo[3]}</Badge>
                                </div>
                                <h2 className={cn('text-white text-lg sm:text-4xl font-bold leading-none', bebas_nueue.className)}>{anime?.name}</h2>
                                <div className='flex items-center'>
                                    <div className="mt-2 flex space-x-1 sm:space-x-2 sm:w-[50%] w-[70%]">
                                        <Link href={`/watch/${encodeURIComponent(anime?.id)}?ep=1`} className="w-[100%]">
                                            <Button className="w-full text-xs sm:text-lg text-white">Watch</Button>
                                        </Link>
                                        <Link href={`/animeInfo/${encodeURIComponent(anime?.id)}`} >
                                            <Button className="bg-white/80 sm:bg-white text-[12px] leading-none sm:text-sm text-black hover:bg-gray-100/50 sm:hidden sm:group-hover:block py-0 px-2"><ArrowRight /></Button>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CarouselBanner
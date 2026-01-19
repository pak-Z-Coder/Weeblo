import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils';
import SaveAnimeButton from './SaveAnimeButton';
import RemoveAnimeButton from './RemoveAnimeButton';
import { History } from 'lucide-react';


const CustomAnimeCard = ({ anime, type }) => {
    const { name, animeId, poster, continueTime, totalTime, episodeNumber } = anime
    return (type == "Saved" ?
        <div className="relative w-full group cursor-pointer z-0 aspect-[2/3] overflow-hidden rounded-lg">
            <div className='md:text-lg rounded-none rounded-bl-lg bg-secondary/50 group-hover:bg-secondary/90 text-sm py-0 px-1 sm:px-2 absolute top-0 right-0 z-30 transition-colors duration-300'><SaveAnimeButton animeId={animeId} type="Saved" /></div>
            <Link href={`/animeInfo/${encodeURIComponent(animeId)}`} className="w-full h-full block relative">
                <img
                    className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 z-0"
                    alt={name}
                    width={300}
                    height={400}
                    src={poster || "/placeholder-cover.jpg"}
                    loading="lazy"
                    onError={(e) => {
                        if (e.target.src !== "/placeholder-cover.jpg") {
                            e.target.src = "/placeholder-cover.jpg";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-950/80 group-hover:via-gray-900/50 group-hover:to-gray-950/95 z-10 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end items-center z-20 text-white font-semibold">
                    <p className={cn("z-20 md:text-base text-xs max-w-full line-clamp-2 overflow-hidden mb-2 sm:mb-3 px-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]")}>{name?.length > 25 ? name.slice(0, 25) + "..." : name}</p>
                </div>
            </Link>
        </div> :
        <div className="relative w-full group cursor-pointer aspect-[2/3] overflow-hidden rounded-lg">
            <div className='md:text-lg w-fit rounded-none rounded-bl-lg bg-secondary/50 group-hover:bg-secondary/90 text-sm p-0 absolute top-0 right-0 z-30 transition-colors duration-300'><RemoveAnimeButton animeId={animeId} /></div>
            <Link href={`/watch/${encodeURIComponent(animeId)}?ep=${episodeNumber}`} className="w-full h-full block relative">
                <img
                    className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 z-0"
                    alt={name}
                    width={300}
                    height={400}
                    src={poster || "/placeholder-cover.jpg"}
                    loading="lazy"
                    onError={(e) => {
                        if (e.target.src !== "/placeholder-cover.jpg") {
                            e.target.src = "/placeholder-cover.jpg";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-950/80 group-hover:via-gray-900/50 group-hover:to-gray-950/95 z-10 transition-all duration-300"></div>
                <div className='sm:text-lg text-white absolute top-2 left-2 font-semibold z-30 textStroke'>
                    <span className="bg-primary/90 px-2 py-0.5 rounded text-xs sm:text-sm">EP{episodeNumber}</span>
                </div>
                <div className='absolute w-full h-full flex items-center justify-center z-10'>
                    <History className='opacity-50 group-hover:opacity-100 w-12 h-12 sm:w-16 sm:h-16 text-white transition-all duration-300 group-hover:scale-110' />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end items-center z-20 text-white font-semibold">
                    <p className={cn("z-20 md:text-base text-xs max-w-full line-clamp-2 overflow-hidden mb-2 sm:mb-3 px-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]")}>{name?.length > 25 ? name.slice(0, 25) + "..." : name}</p>
                </div>
            </Link>
            <div className='absolute bottom-0 left-0 right-0 bg-slate-400/30 rounded-b-lg overflow-hidden'>
                <div className='bg-primary h-1 md:h-2 transition-all duration-300' style={{ width: `${(continueTime / totalTime) * 100}%` }}></div>
            </div>
        </div>
    )
}

export default CustomAnimeCard
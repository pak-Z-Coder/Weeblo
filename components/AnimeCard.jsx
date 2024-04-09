import Image from 'next/image';
import React, { useState } from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { getAnimeInfo } from '@/app/api/getAnimeInfo';
import MiniInfoCard from './MiniInfoCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AnimeCard = ({ anime, type }) => {
    const { rank, name, id, poster } = anime;
    const [animeInfo, setAnimeInfo] = useState({})
    const [fetchLoading, setfetchLoading] = useState(null);
    const handleHover = async (e) => {
        if (type != "season") {
            setfetchLoading(true)
            await getAnimeInfo(anime.id).then(
                (res) => (setAnimeInfo(res))
            );
            setfetchLoading(false)
        }
    }

    return (

        <HoverCard className="inline-block">
            <HoverCardTrigger className="inline-block min-w-fit z-0">
                <Link href={`/animeInfo/${encodeURIComponent(id)}`} className='w-full min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px]'>
                    <div onMouseEnter={handleHover} className=' group rounded-sm ml-1 sm:mb-[0.50rem] mb-1 mt-1 sm:mt-2 cursor-pointer transition-all transform md:hover:scale-105 ease-in-out duration-200 hover:drop-shadow-lg flex items-center justify-center relative'>
                        <div className='absolute h-auto rounded-sm inset-0 bg-gradient-to-b from-gray-200/0 via-gray-900/20 hover:via-gray-900/50 to-gray-950/70 hover:to-gray-950/90 z-20'></div>
                        {type == "season" && <div className='absolute h-auto rounded-sm inset-0 group-hover:backdrop-blur-0 backdrop-blur-sm z-10'></div>}
                        <div className='text-white z-20 w-fit font-semibold'>
                            {type == "Top 10" && <p className='md:text-lg rounded-br-lg text-sm px-1 sm:px-2 bg-secondary/80 absolute top-0 left-0'>{rank}</p>}
                            {!fetchLoading && type !== "season" ?
                                <div className="opacity-0 sm:group-hover:opacity-100 space-x-1 absolute top-3 right-1 sm:right-3">
                                    <Badge variant="outline" className="bg-secondary bg-opacity-90 sm:text-sm text-white border-none">{animeInfo?.anime?.info?.stats?.type}</Badge>
                                    <Badge variant="outline" className="bg-white bg-opacity-90 sm:text-sm text-black border-none">{animeInfo?.anime?.info?.stats?.quality}</Badge>
                                    <Badge variant="outline" className="bg-white/50 sm:text-sm text-black border-none">{anime.duration}</Badge>
                                </div> : <></>
                            }
                            <p className={cn('absolute z-20', type == "season" ? "text-sm bottom-2 left-2 sm:left-3 " : "md:text-lg text-xs max-w-full max-h-[80%] overflow-hidden bottom-2 left-1 sm:bottom-4 sm:left-3")}>{type !== "season" ? name.length > 25 ? name.slice(0, 25) + "..." : name : name.slice(0, 22) + "..."}</p>
                        </div>
                        <img  loading="lazy" quality={100} placeholder='empty' key={id} className={cn('w-fit min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] object-center rounded-sm', type == "season" ? "min-h-[50px] max-h-[50px] min-w-[150px] sm:max-h-[70px] sm:min-h-[70px] sm:min-w-[200px] object-center " : "w-fit min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] object-center shadow-sm hover:shadow-md drop-shadow-md hover:shadow-gray-950")} alt={`${name}`} width={type == "season" ? 100 : 300} height={type == "season" ? 200 : 400} layout="responsive" src={`${poster ? poster : ""}`} />
                    </div></Link></HoverCardTrigger>
            <HoverCardContent className="p-0 min-w-80">
                {
                    fetchLoading && !animeInfo?.anime ?
                        <Loader className="z-20 hidden sm:inline-block w-4 h-4 mx-auto animate-spin text-blue-500" />
                        :
                        type != "season" && <MiniInfoCard anime={animeInfo?.anime} type={type} />

                }
            </HoverCardContent>
        </HoverCard>

    )
}

export default AnimeCard
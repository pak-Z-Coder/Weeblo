import React from 'react'
import AnimeCard from './AnimeCard'
import { Bakbak_One } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import CustomAnimeCard from './CustomAnimeCard'
const bakbak_one = Bakbak_One({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const AnimeGrid = ({ animes, type }) => {
    return (
        <div className='min-h-full max-h-[70vh] md:max-h-full overflow-y-scroll no-scrollbar'>
            <p className={cn("text-secondary mb-4 ml-2 font-bold text-lg sm:text-xl lg:text-2xl select-none", bakbak_one.className)}>{type}</p>
            {!animes && <Loader className="mx-auto mt-5 w-6 h-6 animate-spin text-primary" />}
            {animes?.length > 0 ?
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 px-2">
                    {animes?.map((anime) => (
                        <div key={type != "Saved" ? anime.id : anime.animeId} className="w-full flex justify-center">
                            {type != "Saved" ? <AnimeCard
                                anime={anime}
                                type={type}
                            /> : <CustomAnimeCard anime={anime} type="Saved" />}
                        </div>
                    ))}
                </div> :
                <div className='flex items-center h-full justify-center min-h-[200px]'>
                    <p className='text-xl mt-5 text-red-500/50'>
                        {animes && animes.length != 0 ? "No Results Found!" : "Nothing to show!"}
                    </p>
                </div>
            }
        </div >
    )
}

export default AnimeGrid
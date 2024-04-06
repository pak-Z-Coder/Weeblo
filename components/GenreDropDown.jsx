"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useAppContext } from '@/context/page'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Loader } from "lucide-react"

const GenreDropDown = () => {
    const router = useRouter()
    const { genres } = useAppContext();
    function onSubmit(genre) {
        router.push(`/search/${genre}?type=genre`)
    }
    return (
        <div className='w-full'><DropdownMenu>
            <DropdownMenuTrigger className='flex focus:outline-none text-sm sm:text-[16px] text-white font-semibold'>Genres <ChevronDown /></DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-2.5 sm:min-w-80 max-h-80 no-scrollbar overflow-y-scroll">
                {genres ? <form>
                    <div className='rounded-sm p-1 grid sm:grid-cols-3 grid-cols-2 gap-2 min-w-fit'>
                        {
                            genres?.filter((genre) => (genre != "Harem" && genre != "Josei" && genre != "Ecchi")).map((genre) => {
                                return <Button onClick={(e) => { e.preventDefault(); onSubmit(genre) }} variant="ghost" key={genre} type="submit" value={genre} className="px-1 text-white hover:text-white sm:px-2 dark:hover:bg-primary/50 hover:bg-primary/80">
                                    <DropdownMenuItem className="bg-transparent  text-xs sm:text-sm hover:cursor-pointer sm:px-2">{genre}</DropdownMenuItem>
                                </Button>
                            })
                        }
                    </div>
                </form>
                    : <Loader className="text-primary relative mx-auto h-6 w-6 animate-spin" />
                }
            </DropdownMenuContent>
        </DropdownMenu></div>
    )
}

export default GenreDropDown
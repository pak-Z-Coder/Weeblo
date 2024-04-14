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
import { Button } from './ui/button'
import { Loader } from "lucide-react"
import Link from 'next/link'

const GenreDropDown = () => {
    const { genres } = useAppContext();
    return (
        <div className='w-full'><DropdownMenu>
            <DropdownMenuTrigger className='flex focus:outline-none text-sm sm:text-[16px] text-white font-semibold'>Genres <ChevronDown /></DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-2.5 flex justify-center pl-4 w-fit sm:min-w-80 max-h-80 no-scrollbar overflow-y-scroll">
                {genres ?
                    <div className='rounded-sm grid sm:grid-cols-3 grid-cols-2 gap-2 w-fit'>
                        {
                            genres?.filter((genre) => (genre != "Harem" && genre != "Josei" && genre != "Ecchi")).map((genre) => {
                                return (
                                    <DropdownMenuItem key={genre} className="bg-transparent  text-xs sm:text-sm hover:cursor-pointer sm:px-2">
                                        <Link href={`/search/${genre}?type=genre`} className="w-full">
                                            <Button variant="ghost" type="submit" value={genre} className="px-1 w-full text-white hover:text-white sm:px-2 dark:hover:bg-primary/50 hover:bg-primary/80">
                                                {genre}
                                            </Button>
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            })
                        }
                    </div>
                    : <Loader className="text-primary relative mx-auto h-6 w-6 animate-spin" />
                }
            </DropdownMenuContent>
        </DropdownMenu></div>
    )
}

export default GenreDropDown
"use client"
import React, { useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppContext } from '@/context/page';
import { cn } from '@/lib/utils';
import { Bebas_Neue, Oswald } from 'next/font/google';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog'
import { Edit, Loader } from 'lucide-react';
const EditForm = dynamic(() => import("@/components/EditForm"),
    {
        loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    })
const AnimeGrid = dynamic(() => import("@/components/AnimeGrid"),
    {
        loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    })
const ContinueCard = dynamic(() => import("@/components/ContinueCard"),
    {
        loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    })

const bebas_nueue = Bebas_Neue({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const oswald = Oswald({
    weight: ['500'],
    style: 'normal',
    subsets: ['latin'],
})
const User = () => {
    const [open, setOpen] = useState(null)
    let { user } = useAppContext();

    return (
        <div className='mt-20 min-h-screen'>
            <div className='relative flex w-full flex-col items-center justify-center'>
                <section className='flex flex-col space-y-3 items-center'>
                    <div className=''>
                        <Avatar className="drop-shadow-lg w-28 h-28 lg:w-48 lg:h-48 select-none ring-2 p-1 ring-primary ring-offset-1 ring-offset-transparent">
                            <AvatarImage alt={user?.username[0]} src="https://zz.com/shadcn.png" />
                            <AvatarFallback className="text-[90px] font-medium text-wrap ">{user?.username[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className=''>
                        <h2 className={cn('text-3xl lg:text-4xl', bebas_nueue.className)}>{user?.username}</h2>
                    </div>
                    <div className=''>
                        <h2 className={cn('text-lg text-secondary/70', oswald.className)}>{user?.email}</h2>
                    </div>
                    <div className='absolute top-2 right-4'>
                        <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
                            <DialogTrigger>
                                <Button variant="ghost" className="w-full hover:text-secondary">
                                    <Edit className='max-w-6' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm sm:max-w-md">
                                <div>
                                    <EditForm setOpen={setOpen} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
                <Separator className="my-4" />
                {user &&
                    <section className='grid w-full min-h-[90vh] lg:max-h-[90vh] gap-y-0 grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
                        {user?.continueWatching.length > 0 &&
                            <div className='md:border-r h-fit md:h-full'>
                                <ContinueCard user={user} anime={user?.continueWatching[0]} />
                            </div>
                        }
                        <Separator className="my-4 md:hidden" />
                        <div className={cn('-mt-40 sm:mt-0 md:col-span-2 lg:col-span-3 px-2', user?.continueWatching.length == 0 && "md:col-span-3 lg:col-span-3")}>
                            <AnimeGrid animes={user?.savedAnime} type={"Saved"} />
                        </div>
                    </section>
                }
            </div>

        </div>
    )

}

export default User;
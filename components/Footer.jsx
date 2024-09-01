import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import ThemeToggler from './ThemeToggler'
import { Separator } from "@/components/ui/separator";


const Footer = () => {

    return (
        <footer className="relative mt-5 bottom-0 bg-gray-100 dark:bg-gray-950">
            <Separator className="sm:mb-4"/>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center pb-4">
                    <div className="flex items-center space-x-2">
                        <Link href="https://www.instagram.com/mzeeshan2005/">
                            <InstagramIcon className="text-pink-600 h-6 w-6" />
                        </Link>
                    </div>
                    <div className="flex space-x-1">
                        <Link href="/search/A-Z?type=search">
                            <Button variant="ghost" className="hover:bg-gray-400">All</Button>
                        </Link>
                        <Link href="/search/0-9?type=search">
                            <Button variant="ghost" className="hover:bg-gray-400">0-9</Button>
                        </Link>
                    </div>
                    < div name="themeToggler" className=''>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className=''><ThemeToggler className="" /></TooltipTrigger>
                                <TooltipContent>
                                    <p>Toogle Theme</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="flex flex-col flex-wrap justify-between items-center pt-4">
                    <div className="flex space-x-2 sm:space-x-4">
                        <Link className="hover:text-gray-300" href="/terms-of-services">
                            Terms of service
                        </Link>
                        <Link className="hover:text-gray-300" href="/comment-policy">
                            Comment Policy
                        </Link>
                        <Link className="hover:text-gray-300" href="mailto:zeeshiiscool@gmail.com">
                            Contact
                        </Link>
                    </div>
                    <p className="text-sm text-gray-400">
                        Weeblo does not store any files on our server, we only use 3rd party media services.
                    </p>
                </div>
                <div className="text-center sm:space-x-10 flex flex-wrap items-center justify-center pt-4">
                    <p className="text-sm text-gray-400">© Weeblo.to All rights reserved.</p>
                    <div className='flex flex-wrap items-center text-sm text-gray-400'><p className="text-sm mr-[0.5rem]">This site uses</p> <Link href="https://kitsu.io/explore/anime" className='text-secondary hover:underline'>Kitsu API</Link> <p className='ml-[0.5rem]'> for 3rd party data.</p></div>
                </div>
            </div>
        </footer >
    )
}

export default Footer


function FacebookIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>)
    );
}


function TwitterIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path
                d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>)
    );
}


function InstagramIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>)
    );
}


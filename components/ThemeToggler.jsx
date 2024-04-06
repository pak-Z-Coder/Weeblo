"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const ThemeToggler = ({inHeader}) => {
    const { setTheme } = useTheme("dark")

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Button variant="ghost" size="icon" className={cn(inHeader&&"text-white")}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-xl w-fit p-0">
                <DropdownMenuItem className="cursor-pointer w-fit text-white font-semibold ml-auto" onClick={() => setTheme("light")}>
                    Light <Sun/> 
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-fit ml-auto text-white font-semibold" onClick={() => setTheme("dark")}>
                    Dark <Moon/> 
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default ThemeToggler;

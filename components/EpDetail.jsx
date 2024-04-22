import { cn } from "@/lib/utils";
import { Bakbak_One, Bebas_Neue } from "next/font/google";  
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
const bakbak_one = Bakbak_One({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
})
const bebas_nueue = Bebas_Neue({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
})
export default function EpDetail({ epInfo, animeExtraInfo, title, animeInfo }) {
  const [openEps, setOpenEps] = useState(true)
  return (

    (<div className="">
      <div className="flex mb-2 justify-between items-center">
        <h2 className={cn("text-xl font-semibold text-secondary", bakbak_one.className)}>Description</h2>
        <Button onClick={() => { setOpenEps(!openEps) }} variant="outline"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none">
          {!openEps && <ChevronUp className="h-5 w-5" />}
          {openEps && <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      <div className={cn("opacity-0 h-0 space-y-2 relative transition-opacity duration-200 ease-in", !openEps && "opacity-100 h-fit transition-opacity duration-200 ease-out")}>
        <div className="flex space-x-3 overflow-hidden">
          <img
            alt="thumbnail"
            className="rounded w-40 max-h-48 "
            width={300}
            height={400}
            src={epInfo?.thumbnail ? epInfo.thumbnail : animeExtraInfo?.posterImage ? animeExtraInfo?.posterImage : animeInfo?.anime?.info?.poster} />
          <div className="space-y-2">
            <p className={cn("text-lg font-medium leading-none", bebas_nueue.className)}>{epInfo?.canonicalTitle ? epInfo.canonicalTitle : title}</p>
            <div className=" items-center text-sm">
              <p className="text-gray-500 dark:text-gray-400">Aired on {epInfo?.airdate ? epInfo.airdate : animeExtraInfo?.startDate ? animeExtraInfo.startDate : animeInfo?.anime?.moreInfo.aired ? animeInfo?.anime?.moreInfo.aired : "?"}</p>
              <p className="text-gray-500 dark:text-gray-400">{epInfo?.length ? epInfo.length : animeExtraInfo?.episodeLength ? animeExtraInfo.episodeLength : animeInfo?.anime?.info?.stats?.duration ? animeInfo?.anime?.info?.stats?.duration : "?"} min</p>
            </div>
          </div>
        </div>
        <div className="">
          <p className="text-sm max-h-60 overflow-y-scroll no-scrollbar text-gray-600 dark:text-gray-400">
            {epInfo?.description ? epInfo.description : animeExtraInfo?.description ? animeExtraInfo?.description : animeInfo?.anime?.info?.description ? animeInfo?.anime?.info?.description : "?"}
          </p>
        </div>
      </div>
    </div>
    )
  );
}

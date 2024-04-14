
import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge";
import { Star, StarHalf, StarOff, Subtitles, Mic, Bookmark, Loader2 } from "lucide-react"
import ReactPlayer from "react-player";
import { AspectRatio } from "./ui/aspect-ratio";
import { useEffect, useState } from "react";
import { getAnimeExtraInfo } from '@/app/api/getAnimeExtraInfo';
import { cn } from "@/lib/utils";
import Link from "next/link";
import SaveAnimeButton from "./SaveAnimeButton";

export default function MiniInfoCard({ anime, type }) {
  const renderStars = () => {
    const fullStars = Math.floor(anime?.moreInfo.malscore / 2);
    const hasHalfStar = anime?.moreInfo?.malscore % 2 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star className="w-4 text-yellow-500" key={i} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf className="w-4 text-yellow-500" key={fullStars} />);
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<Star className="w-4 text-yellow-500" key={i} />);
    }
    return stars;
  };
  const [animeExtraInfo, setAnimeExtraInfo] = useState()
  const fetchExtraInfo = async () => {
    await getAnimeExtraInfo(anime?.info?.name, anime?.moreInfo?.japanese).then(
      (res) => (setAnimeExtraInfo(res))
    );
  }
  useEffect(() => {
    if (type != "season") {
      fetchExtraInfo();
    }
  }, [anime])
  return (

    (<div className="w-full max-h-full hidden sm:inline-block">
      <AspectRatio className={cn("hidden overflow-hidden ", animeExtraInfo?.youtubeVideoId && "flex items-center justify-center")} ratio={animeExtraInfo?.youtubeVideoId ? 100 / 57 : null}>
        <ReactPlayer
          playing={animeExtraInfo?.youtubeVideoId && true}
          url={`https://www.youtube.com/watch?v=${animeExtraInfo?.youtubeVideoId}`}
          config={{ playerVars: { cc_lang_pref: 'en', cc_load_policy: 1 } }}
          controls={false}
          className={cn("aspect-square hidden sm:inline-block")}
        />
      </AspectRatio>
      <div className="p-4 grid gap-2">
        <div className="">
          <h2 className="text-xl text-white font-bold leading-none">{anime?.info.name}</h2>
          <div className="mt-1 pt-1 flex justify-between">
            <div>{
              anime?.moreInfo?.malscore != "?" ?
                <div className="flex items-center">
                  {renderStars()}
                  <p className="text-sm font-bold leading-none">{anime?.moreInfo.malscore}</p>
                </div>
                :
                <div><StarOff className="w-4 text-yellow-500" /></div>
            }</div>
            <div className="border-none flex space-x-1">
              {anime?.info?.stats?.episodes &&
                Object.entries(anime?.info?.stats?.episodes).map(([type, eps],i) => <Badge key={i} variant="secondary" className="px-2 py-0 text-white leading-none max-w-xs flex items-center">
                  {type == "sub" ? <Subtitles className="w-4" /> : <Mic className="w-4" />}
                  <p className="text-xs">{eps ? eps : 0}</p>
                </Badge>)
              }
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="grid gap-1.5">
            <div className="space-x-1">
              {anime?.moreInfo?.genres?.slice(0, 3)?.map((genre) => <Badge key={genre} variant="outline" className="text-white text-sm leading-none border-secondary">{genre}</Badge>)}
            </div>
            <p className="text-sm leading-none text-white">
              {anime?.info?.description?.slice(0, 156) + "..."}
            </p>
          </div>
        </div>
        <div className="flex p-0">
          {anime && <SaveAnimeButton animeId={anime?.info?.id} name={anime?.info?.name} poster={anime?.info?.poster} />}
          <Link href={`/watch/${encodeURIComponent(anime?.info?.id)}?ep=1`} className="ml-2 flex-1">
            <Button className="w-full">Watch</Button>
          </Link>
        </div>
      </div>
    </div>)
  );
}

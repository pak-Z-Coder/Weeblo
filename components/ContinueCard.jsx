import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import Link from "next/link";
import RemoveAnimeButton from "./RemoveAnimeButton";


export default function ContinueCard({ anime, user }) {
  const { name, animeId, poster, continueTime, totalTime, episodeNumber } = anime

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours > 0 ? hours.toString().padStart(2, '0') + ':' : '';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    (<Card className="w-full md:h-full rounded-lg overflow-hidden space-y-1">
      <div style={{ backgroundImage: `url(${poster})` }} className={cn("relative bg-cover md:h-[50%] flex items-center justify-center z-0")}>
        <div className="absolute inset-0 h-full rounded-lg bg-gradient-to-b from-gray-200/0 via-gray-900/20 hover:via-gray-900/50 to-gray-950/70 hover:to-gray-950/90 z-10"></div>
        <div className="absolute inset-0 h-full backdrop-blur-sm z-10"></div>
        <img
          alt="Anime Poster"
          className="bg-transparent z-20 rounded-sm drop-shadow-md max-h-[150px] min-w-[120px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] object-contain"
          height="400"
          src={poster}
          width="300"
          layout="responsive" />
        <div
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 flex items-center justify-center">
        </div>
      </div>
      <CardContent className="p-4 md:h-[45%]  flex flex-col flex-grow justify-around">
        <div className="relative space-x-1 flex items-center justify-around max-w-full font-semibold text-xs overflow-hidden">
          <p>{continueTime ? formatTime(continueTime) : "00:00:00"}</p>
          <div className='flex-1 bg-slate-300'>
            <div className='bg-primary h-1 md:h-2 max-w-full' style={{ width: `${(continueTime / totalTime) * 100}%` }}></div>
          </div>
          <p>{totalTime ? formatTime(totalTime) : "00:00:00"}</p>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">{name}</h3>
          <p className="md:text-lg opacity-70">EP{episodeNumber}</p>
          <p className="text-sm opacity-70 mt-1">{user.username} · Last seen</p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <RemoveAnimeButton animeId={animeId} />
          <Link href={`/watch/${encodeURIComponent(animeId)}?ep=${episodeNumber}`} className="w-fit">
            <Button className="bg-primary/80 text-white" variant="ghost">
              <History className="w-4 h-4 mr-2" />
              Continue
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>)
  );
}


function DribbbleIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>)
  );
}



function ShuffleIcon(props) {
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
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>)
  );
}

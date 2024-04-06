"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { AvatarImage, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
import { getAnimeEpisodes } from "@/app/api/getAnimeEpisodes"
import { getAnimeInfo } from '@/app/api/getAnimeInfo'
import { getEpisodeDetail } from "@/app/api/getEpisodeDetail"
import { getAnimeExtraInfo } from "@/app/api/getAnimeExtraInfo"
import { Bebas_Neue } from "next/font/google"
import { getAnimeEpisodeServerLink, getAnimeEpisodeServers } from "@/app/api/getAnimeEpisodeServers"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import Link from "next/link"
const VideoPlayer = React.lazy(() => import('@/components/VideoPlayer'));
const AnimeVerticalCarousel = React.lazy(() => import('@/components/AnimeVerticalCarousel'));
const EpisodesList = React.lazy(() => import('@/components/EpisodesList'));
const EpDetail = React.lazy(() => import('@/components/EpDetail'));
const DisqusComments = React.lazy(() => import('@/components/DisqusComments'));
const ScrollTopButton = React.lazy(() => import('@/components/ScrollTopButton'));
import { useAppContext } from '@/context/page'

const bebas_nueue = Bebas_Neue({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
})
const initialUserPreferences = {
    AutoPlay: false,
    AutoNext: true,
    qualityLevel: 720,
    volumeLevel: 0.9
};

const getUserPreferencesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const preferences = localStorage.getItem('userPreferences');
        return preferences ? JSON.parse(preferences) : initialUserPreferences;
    } else {
        return initialUserPreferences;
    }
};

const setUserPreferencesToLocalStorage = (preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
};
export default function WatchPage({ params: { id } }) {
    let { user, setUser } = useAppContext();
    const searchParams = useSearchParams();
    const animeId = decodeURI(id)
    const [fetchLoading, setfetchLoading] = useState(null);
    const [serverLoading, setServerLoading] = useState(null);
    const [fetchLoading2, setfetchLoading2] = useState(null);
    const [episodesResults, setEpisodesResults] = useState(null);
    const [userPreferences, setUserPreferences] = useState(getUserPreferencesFromLocalStorage)
    const [episodeServers, setEpisodeServers] = useState(null);
    const [epEnded, setEpEnded] = useState(false);
    const [episodeServerLink, setEpisodeServerLink] = useState(null);
    const [animeInfo, setAnimeInfo] = useState(null)
    const [animeExtraInfo, setAnimeExtraInfo] = useState(null)
    const [epInfo, setEpInfo] = useState(null)
    const [currentEp, setCurrentEp] = useState(null)
    const [currentServerType, setCurrentServerType] = useState("sub")
    const [playedTime, setPlayedTime] = useState(0);
    const [totalTime, setTotalTime] = useState(null);
    const [continueWatchTime, setContinueWatchTime] = useState(null);
    const fetchEpisodes = async () => {
        setfetchLoading(true)
        await getAnimeEpisodes(animeId).then((res) => setEpisodesResults(res))
        setfetchLoading(false)
    }
    const fetchEpServers = async () => {
        if (!currentEp) return
        await getAnimeEpisodeServers(currentEp.episodeId).then((res) => setEpisodeServers(res))
    }
    const fetchEpServerLink = async () => {
        if (!currentServerType) return
        setServerLoading(true)
        await getAnimeEpisodeServerLink(currentEp?.episodeId, "hd-1", currentServerType).then((res) => setEpisodeServerLink(res))
        setServerLoading(false)
    }
    const fetchInfo = async () => {
        setfetchLoading2(true)
        await getAnimeInfo(animeId).then(
            (res) => (setAnimeInfo(res))
        );
        setfetchLoading2(false)
    }
    const fetchExtraInfo = async () => {
        setfetchLoading2(true)
        await getAnimeExtraInfo(animeInfo?.anime?.info?.name, animeInfo?.anime?.moreInfo?.japanese).then(
            (res) => (setAnimeExtraInfo(res))
        );
        setfetchLoading2(false)
    }
    const fetchEPInfo = async () => {
        try {
            setfetchLoading2(true)
            if (!animeExtraInfo) return
            const res = await fetch(animeExtraInfo?.episodes, {
                headers: {
                    Accept: "application/vnd.api+json",
                    "Content-Type": " application/vnd.api+json",
                },
                next: {
                    revalidate: 60 * 60 * 24,
                },
            })
            const epsData = await res.json();
            if (epsData.data.length < currentEp?.number) {
                setEpInfo(null)
                return setfetchLoading2(false)
            }
            const epId = epsData.data[(currentEp?.number) - 1].id;
            await getEpisodeDetail(epId).then(
                (res) => (setEpInfo(res))

            );
            setfetchLoading2(false)
        } catch (error) {
            console.error("Error fetching episode data:", error);
            setfetchLoading2(false)
        }

    }
    const continueWatchingHandler = async () => {

        const continueWatchingData = {
            animeId,
            name: animeInfo?.anime?.info?.name,
            poster: animeInfo?.anime?.info?.poster,
            continueTime: playedTime,
            totalTime: totalTime,
            episodeNumber: currentEp?.number,
            userEmail: user.email
        }
        try {
            const response = await fetch('/api/continueAnime', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(continueWatchingData),
            })
            const data = await response.json();
            if (data.status == 200) {
                const updatedAnime = {
                    animeId: continueWatchingData.animeId,
                    continueTime: continueWatchingData.continueTime,
                    totalTime: continueWatchingData.totalTime,
                    episodeNumber: continueWatchingData.episodeNumber,
                    name: continueWatchingData.name,
                    poster: continueWatchingData.poster,
                };

                // Find the index of the anime in the continueWatching array
                const index = user.continueWatching.findIndex(
                    (anime) => anime.animeId === continueWatchingData.animeId
                );

                // Create a copy of the user object with updated continueWatching array
                const updatedUser = {
                    ...user,
                    continueWatching: [...user.continueWatching], // Create a shallow copy of the array
                };

                if (index !== -1) {
                    updatedUser.continueWatching.splice(index, 1);
                    // Add the updated anime back to the beginning of the array
                    updatedUser.continueWatching.unshift(updatedAnime);
                } else {
                    // Add the new anime to the beginning of the continueWatching array
                    updatedUser.continueWatching.unshift(updatedAnime);
                }

                // Update the user state with the updated user object
                setUser(updatedUser);
            }
            else {
                throw new Error(data.body.message);
            }
        } catch (error) {
            console.log(error.message);
        }

    }
    const handleCheckboxChange = (key, value) => {
        setUserPreferences(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    useEffect(() => {
        fetchEpisodes();
        fetchInfo();
    }, [])
    useEffect(() => {
        const epNumber = searchParams?.get("ep");
        if (!epNumber) return
        if (Number(epNumber) < episodesResults?.episodes.length) {
            setCurrentEp(episodesResults?.episodes[Number(epNumber - 1)])
        } else {
            setCurrentEp(episodesResults?.episodes[Number(episodesResults?.episodes.length - 1)])
        }
    }, [episodesResults, searchParams])
    useEffect(() => {
        fetchEpServers();
    }, [currentEp])
    useEffect(() => {
        fetchEpServerLink();
    }, [currentServerType, currentEp])
    useEffect(() => {
        if (!animeInfo) return
        fetchExtraInfo();
        fetchEPInfo();
    }, [animeInfo])
    useEffect(() => {
        if (animeInfo?.anime?.info?.stats?.type == "TV" || animeInfo?.anime?.info?.stats?.type == "OVA" || animeInfo?.anime?.info?.stats?.type == "Special" || animeInfo?.anime?.info?.stats?.type == "ONA") {
            fetchEPInfo();
        } else {
            return
        }
    }, [animeExtraInfo, currentEp])
    useEffect(() => {
        const storedPreferences = localStorage.getItem('userPreferences');
        if (storedPreferences) {
            setUserPreferences(JSON.parse(storedPreferences));
        }
    }, []);

    useEffect(() => {
        setUserPreferencesToLocalStorage(userPreferences)
    }, [userPreferences]);
    useEffect(() => {
        if (epEnded && currentEp?.number < episodesResults?.episodes.length) {
            setCurrentEp(episodesResults?.episodes[currentEp?.number])
            setEpEnded(false)
        }
    }, [epEnded]);
    useEffect(() => {
        if (!user || !playedTime || !totalTime || Math.floor(playedTime % 5) != 0 || Math.round(playedTime % 5) != 0) return
        continueWatchingHandler();
    }, [playedTime, totalTime])
    useEffect(() => {
        if (!user || !currentEp) return
        const anime = user.continueWatching.filter(anime => anime.animeId === animeId)[0]
        if (anime?.episodeNumber == currentEp.number) {
            setContinueWatchTime(anime.continueTime)
        } else {
            setContinueWatchTime(null)
        }
    }, [user, currentEp, serverLoading])
    return (
        !fetchLoading ? <div className="lg:pl-1 flex-grow-0 flex flex-col mt-10 sm:mt-16">
            <div className="relative flex flex-col">
                <div className='flex gap-2 flex-col lg:flex-row'>
                    <div className="flex-grow mb-2 lg:mb-0 max-h-[90vh] bg-black aspect-video lg:min-w-[75vw] px-2 py-4 sm:p-0" >
                        {serverLoading && <Loader className="mx-auto relative top-1/2 h-8 w-8 animate-spin text-primary" />}
                        {!serverLoading && <VideoPlayer Url={episodeServerLink?.sources && episodeServerLink?.sources[0]?.url} tracks={episodeServerLink?.tracks} type={episodeServerLink?.sources && episodeServerLink?.sources[0]?.type} outro={episodeServerLink?.outro} intro={episodeServerLink?.intro} setEpEnded={setEpEnded} userPreferences={userPreferences} setUserPreferences={setUserPreferences} setPlayedTime={setPlayedTime} setTotalTime={setTotalTime} continueWatchTime={continueWatchTime} />}
                    </div>
                    <EpisodesList animeId={animeId} episodes={episodesResults?.episodes} currentEp={currentEp} />
                </div>
                <div className='grid lg:grid-cols-4'>
                    <div className="px-4 col-span-1 lg:col-span-3 py-2">
                        <div className="w-fit ml-auto mb-2 lg:mb-0 flex space-x-3 text-xs items-center">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    defaultChecked={false}
                                    checked={userPreferences?.AutoPlay}
                                    onCheckedChange={(checked) => handleCheckboxChange('AutoPlay', checked)}
                                    id="autoPlay"
                                />
                                <label
                                    htmlFor="autoPlay"
                                    className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Auto Play
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    defaultChecked={true}
                                    checked={userPreferences?.AutoNext}
                                    onCheckedChange={(checked) => handleCheckboxChange('AutoNext', checked)}
                                    id="autoNext"
                                />
                                <label
                                    htmlFor="autoNext"
                                    className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Auto Next
                                </label>
                            </div>
                        </div>
                        <h1 className={cn("text-2xl md:text-3xl font-bold", bebas_nueue.className)}>
                            {animeInfo?.anime?.info?.stats?.type != "TV" ? animeInfo?.anime?.info?.name + " - " + currentEp?.title : currentEp?.number + " - " + currentEp?.title}
                        </h1>
                        {/* {animeExtraInfo?.favoritesCount &&
                            <p className="text-gray-600">{animeExtraInfo.favoritesCount} views</p>
                        } */}
                        <div className="flex justify-between items-centers space-x-4 my-4">
                            <div>
                                <Button variant="ghost">Share</Button>
                                <Button variant="ghost">Download</Button>
                            </div>
                            <div className="flex  items-center space-x-2">
                                <ToggleGroup type="single" value={currentServerType} onValueChange={(e) => { setCurrentServerType(e) }}>
                                    <ToggleGroupItem value="sub" aria-label="Original" className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                                        Original
                                    </ToggleGroupItem>
                                    {
                                        episodeServers?.dub?.length > 0 && <ToggleGroupItem value="dub" aria-label="Dubbed" className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                                            Dubbed
                                        </ToggleGroupItem>
                                    }
                                </ToggleGroup>
                            </div>
                        </div>
                        <div >
                            <Link className="flex items-center space-x-2 my-2" href={`/animeInfo/${encodeURIComponent(id)}`} >
                                <Avatar className="">
                                    <AvatarImage alt={animeInfo?.anime?.info?.name[0]} src={animeInfo?.anime?.info?.poster} />
                                </Avatar>
                                <span className="text-sm font-semibold">{animeInfo?.anime?.info?.name}</span>
                            </Link>
                        </div>
                        <div className="mt-4 space-y-2">
                            {
                                fetchLoading2 ? <Loader className="mx-auto my-auto h-6 w-6 animate-spin text-secondary" /> :
                                    <EpDetail epInfo={epInfo} animeInfo={animeInfo} animeExtraInfo={animeExtraInfo} title={animeInfo?.anime?.info?.stats?.type != "TV" ? animeInfo?.anime?.info?.name : currentEp?.title} />
                            }
                        </div>
                        <div className="rounded-lg mt-5 overflow-hidden z-0">
                            {currentEp && <DisqusComments episode={{ title: currentEp?.title, animeId: animeId, epNumber: currentEp?.number }} />}
                        </div>
                    </div>
                    <div className="w-full lg:w-80 p-4">
                        <div>
                            <AnimeVerticalCarousel animes={animeInfo?.relatedAnimes} type={"Related"} page="info" />
                        </div>
                    </div>
                </div>
            </div>
            <ScrollTopButton />
        </div >
            : <Loader className="mx-auto relative top-48 h-12 w-12 animate-spin text-primary" />
    );
}
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils';
import { ChevronUp, Pause, Play, RedoDot, Subtitles, UndoDot, Fullscreen, Minimize, Loader2, Volume, Volume1, Volume2, SkipForward } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { debounce } from 'lodash';
import { Separator } from './ui/separator';
import { Kanit } from 'next/font/google';
const kanit = Kanit({
    weight: ['500'],
    style: 'normal',
    subsets: ['latin'],
})
const VideoPlayer = ({ Url, tracks, type, intro, outro, setEpEnded, userPreferences, setUserPreferences, setPlayedTime, setTotalTime, continueWatchTime }) => {
    const player = useRef()
    const [showControls, setShowControls] = useState(false)
    const [showCursor, setShowCursor] = useState(false)
    const [currentTime, setCurrentTime] = useState(0);
    const [loadedTime, setLoadedTime] = useState(0);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);
    const [playing, setPlaying] = useState(userPreferences?.AutoPlay)
    const [duration, setDuration] = useState(0);
    const [qualities, setQualities] = useState(null);
    const [currentQuality, setCurrentQuality] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [volume, setVolume] = useState(userPreferences?.volumeLevel ? userPreferences?.volumeLevel : 0.9);
    const progressIntervalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    let controlsTimeout;
    let cursorTimeout;
    const [captions, setCaptions] = useState(null);
    const [captionsToUse, setCaptionsToUse] = useState([]);
    const [currentCaption, setCurrentCaption] = useState('');
    useEffect(() => {
        const defaultTrackIndex = tracks?.findIndex(track => track.default);
        setCaptions(
            tracks
                ?.filter(track => track.kind === 'captions')
                .map((track, index) => ({
                    src: track.file,
                    label: track.label,
                    default: track.default || false,
                    index: index
                }))
        );
        setSelectedTrack(defaultTrackIndex !== -1 ? defaultTrackIndex : 0);
    }, [tracks])
    async function fetchSubtitleFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch subtitle file');
            }
            const vttContent = await response.text();
            return vttContent;
        } catch (error) {
            console.error('Error fetching subtitle file:', error);
            return null;
        }
    }
    function parseVTT(vttContent) {
        // Split the VTT content into individual lines
        const lines = vttContent?.trim().split(/\r?\n/);

        let subtitles = [];
        let cue = null;

        // Parse each line of the VTT file
        for (let line of lines) {
            if (line.includes('-->')) {
                // If the line contains a timestamp, create a new cue object
                const [startTimeStr, endTimeStr] = line.split(' --> ');
                const startTime = timeStrToSeconds(startTimeStr.trim());
                const endTime = timeStrToSeconds(endTimeStr.trim());
                cue = { startTime, endTime, text: '' };
            } else if (cue && line.trim() !== '') {
                // If the line is not empty and a cue object exists, add the line to the cue's text
                if (cue.text !== '') {
                    cue.text += '\n'; // Add newline if this isn't the first line of text
                }
                cue.text += line.trim();
            } else if (cue && line.trim() === '') {
                // If the line is empty and a cue object exists, push the cue object to the subtitles array
                subtitles.push(cue);
                cue = null; // Reset cue object
            }
        }
        return subtitles;
    }
    function timeStrToSeconds(timeStr) {
        const parts = timeStr.split(':').map(parseFloat);
        let seconds = 0;
        if (parts.length === 3) {
            // Format: HH:MM:SS.mmm
            seconds += parts[0] * 3600; // Hours to seconds
            seconds += parts[1] * 60;   // Minutes to seconds
            seconds += parts[2];        // Seconds
        } else if (parts.length === 2) {
            // Format: MM:SS.mmm or SS.mmm
            if (timeStr.includes(':')) {
                // Format: MM:SS.mmm
                seconds += parts[0] * 60;  // Minutes to seconds
                seconds += parts[1];       // Seconds
            } else {
                // Format: SS.mmm
                seconds += parts[0];       // Seconds
            }
        }
        return seconds;
    }
    useEffect(() => {
        if (selectedTrack == "off" || !captions || !captions[selectedTrack]) return
        fetchSubtitleFile(captions[selectedTrack].src)
            .then((vttContent) => {
                if (vttContent) {
                    const cap = parseVTT(vttContent);
                    setCaptionsToUse(cap)
                }
            })
    }, [selectedTrack, captions])
    const stripHtmlTags = (text) => {
        return text.replace(/<[^>]*>?/gm, ''); // Remove all HTML tags
    };
    useEffect(() => {
        if (selectedTrack == "off") return
        const caption = captionsToUse?.find(
            (caption) => caption.startTime <= currentTime && currentTime <= caption.endTime
        );
        setCurrentCaption(caption ? stripHtmlTags(caption.text) : '');
    }, [currentTime, captionsToUse]);
    useEffect(() => {
        return () => {
            clearInterval(progressIntervalRef.current);
        };
    }, []);
    useEffect(() => {
        const p = document.querySelector("#player")
        const pA = document.querySelector("#playerAbsolute")
        if (!p) return;
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    skipTime(-10)
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    skipTime(10)
                    break;
                default:
                    break;
            }
        };

        const handleDoubleClick = () => {
            if (p && !document.fullscreenElement) {
                p.requestFullscreen();
                setIsFullScreen(true)
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false)
            }
        };
        const handleMouseMove = () => {

            clearTimeout(controlsTimeout);
            setShowControls(true)
            controlsTimeout = setTimeout(() => {
                setShowControls(false)
            }, 3000);
        }
        p.addEventListener('keydown', handleKeyDown);
        pA.addEventListener('dblclick', handleDoubleClick);
        p.addEventListener('mousemove', handleMouseMove);
        p.addEventListener('mouseleave', () => setShowControls(false));
        return () => {
            p.removeEventListener('keydown', handleKeyDown);
            pA.removeEventListener('dblclick', handleDoubleClick);
            p.addEventListener('mousemove', handleMouseMove);
            p.addEventListener('mouseleave', () => setShowControls(false));

        };
    }, [player.current]);
    useEffect(() => {
        const videoElement = document.querySelector("#player");
        const handleMouseMove = () => {
            clearTimeout(cursorTimeout);
            setShowCursor(true)
            cursorTimeout = setTimeout(() => {
                setShowCursor(false)
            }, 3000);
        };
        videoElement.addEventListener('mousemove', handleMouseMove);
        return () => {
            videoElement.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isFullScreen]);
    useEffect(() => {
        const videoElement = document.querySelector("#player");
        if (playing && isFullScreen && videoElement && !showCursor) {
            videoElement.style.cursor = 'none';
        } else {
            videoElement.style.cursor = 'auto';
        }
    }, [showCursor])
    useEffect(() => {
        const handleFullScreenChange = () => {
            if (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            ) {
                setIsFullScreen(true);
            } else {
                setIsFullScreen(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);
    useEffect(() => {
        const p = document.querySelector("#player")
        if (p && !document.fullscreenElement) {
            isFullScreen && p.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }, [isFullScreen])
    const setLoadedDurationDebounced = debounce((value) => {
        setLoadedTime(value);
    }, 500);
    useEffect(() => {
        const interval = setInterval(() => {
            if (player.current) {
                const loaded = player.current.getSecondsLoaded();
                const total = player.current.getDuration();
                const percentage = (loaded / total) * 100;
                setLoadedDurationDebounced(percentage);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            // Clear the debounced function to avoid memory leaks
            setLoadedDurationDebounced.cancel();
        };
    }, [setLoadedDurationDebounced]);

    const skipTime = (time) => {
        player.current.seekTo(player.current.getCurrentTime() + time)
    }
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedHours = hours > 0 ? hours.toString().padStart(2, '0') + ':' : '';
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
    const handleProgress = (progress) => {
        setLoading(false)
        setCurrentTime(progress.playedSeconds);
        setLoadedTime(progress.loadedSeconds);
        setTotalTime(player?.current.getDuration())
        setPlayedTime(progress.playedSeconds);
    };
    const handleDuration = (duration) => {
        setDuration(duration);
        progressIntervalRef.current = setInterval(() => {
            if (player.current && player.current.getCurrentTime) {
                setCurrentTime(player.current.getCurrentTime());
            }
        }, 1000);
    };
    const handleSeek = (value) => {
        value = value[0]
        if (player.current) {
            player.current.seekTo((value) / duration);
        }
    };
    const getQuality = () => {
        const internalPlayer = player.current?.getInternalPlayer(type);
        setQualities(internalPlayer.levels.reverse())
        if (userPreferences?.qualityLevel != -1) {
            const existI = internalPlayer.levels.findIndex(l => l.height == userPreferences.qualityLevel);
            if (existI != -1) {
                internalPlayer.currentLevel = existI;
                setCurrentQuality(existI);
            }
            else {
                setCurrentQuality(-1);
            }
        }
        else {
            setCurrentQuality(-1);
        }
    }
    const changeQuality = (qIndex) => {
        const internalPlayer = player.current && player.current.getInternalPlayer(type);
        if (internalPlayer && internalPlayer.currentLevel !== undefined) {
            internalPlayer.currentLevel = qIndex;
            setUserPreferences(prevState => ({
                ...prevState,
                qualityLevel: qualities[qIndex]?.height
            }));
        }
        setPlaying(true)
    }
    return (
        <div id="player" className={cn('z-0 relative w-full h-full')}>
            <div id="playerAbsolute" className='z-10 absolute h-[85%] w-full'></div>
            <ReactPlayer
                ref={player}
                volume={volume}
                playing={playing}
                onBuffer={() => setLoading(true)}
                onPlay={() => setLoading(false)}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onReady={() => { getQuality(); setLoading(false); setTotalTime(player?.current.getDuration()); player?.current.seekTo(continueWatchTime ? continueWatchTime : 0) }}
                onEnded={() => { userPreferences?.AutoNext && setEpEnded(true) }}
                // onError={() => setError(true)}
                url={Url}
                controls={false}
                config={{
                    file: {
                        attributes: { crossOrigin: "true" },
                    }
                }}
                className={cn("md:w-full focus:outline-none md:h-full object-center")}
                width="100%"
                height="100%"
            />
            <div className='z-20 absolute bottom-20 right-2 w-fit ml-auto mr-2 '>
                <Button onClick={() => player.current.seekTo(intro.end)} variant="outline" className={cn("drop-shadow-lg shadow-lg cursor-pointer hover:bg-transparent bg-secondary/20 border-white hidden  mb-1", currentTime >= intro?.start && currentTime <= intro?.end && currentTime != 0 && "flex")}>Skip<SkipForward /></Button>
                <Button onClick={() => player.current.seekTo(outro.end)} variant="outline" className={cn("drop-shadow-lg shadow-lg cursor-pointer hover:bg-transparent bg-secondary/20 border-white hidden  mb-1", currentTime >= outro?.start && currentTime <= outro?.end && currentTime != 0 && "flex")}>Skip<SkipForward /></Button>
            </div>
            <div className={cn('absolute w-full bottom-5 sm:bottom-10', showControls && "bottom-8 sm:bottom-20", kanit.className)}>
                <p className="sm:textStroke sm:font-semibold font-sans text-white bg-black/50 sm:bg-black/40 px-1 mx-auto text-sm sm:text-lg md:text-xl lg:text-2xl text-center w-fit lg:max-w-[95%] max-w-[98%] ">
                    {selectedTrack !== "off" && currentCaption}
                </p>
            </div>
            {loading && <Loader2 className="absolute h-8 w-8 animate-spin text-white left-[45%] top-[40%] sm:left-[49%] sm:top-[47%]" />}
            <Button onClick={() => setPlaying(!playing)} className={cn("z-20 inset-x-1/3 inset-y-1/3 absolute inline-block opacity-100 text-white bg-black bg-opacity-50 rounded-full w-fit mx-auto my-auto py-1 px-4 sm:px-8 sm:py-2", loading && "hidden", !showControls && !isOpen && !isOpen1 && "opacity-0 hidden transition-opacity ease-out")} size="lg" variant="ghost">
                {playing ?
                    <Pause className="max-w-6 max-h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <div className={cn("z-0 absolute h-full w-full inset-0 opacity-100 flex flex-col justify-end ", !showControls && !isOpen && !isOpen1 && "opacity-0 hidden transition-opacity ease-out")} >
                <div className="w-full bg-black/20">
                    <div className="mb-2 pb-2 relative flex items-center justify-around max-w-full font-semibold text-xs text-white textStrokeSmall pt-3 overflow-hidden">
                        <p>{currentTime ? formatTime(currentTime) : "00:00:00"}</p>
                        <Slider value={[currentTime]} min={0} max={duration} loadedTime={loadedTime} onValueChange={(e) => handleSeek(e)} step={10} className="w-[90%]" />
                        <p>{player?.current?.getDuration() ? formatTime(player?.current?.getDuration()) : "00:00:00"}</p>
                    </div>
                    <div className="flex items-center gap-0 lg:gap-2 ">
                        <div className="lg:ml-5 text-white">
                            <Button onClick={() => setPlaying(!playing)} className="hidden sm:inline-block p-2 bg-transparent border-none" variant="outline">
                                {playing ?
                                    <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                        </div>
                        <div className="relative ml-1 text-white flex items-center">
                            {volume == 0 && <Volume />}
                            {volume > 0 && volume <= 50 && <Volume1 />}
                            {volume > 50 && <Volume2 />}
                            <Slider volumeBar={true} value={[volume]} min={0} max={1} onValueChange={(e) => {
                                setVolume(e);
                                setUserPreferences(prevState => ({ ...prevState, volumeLevel: e }));
                            }} step={0.1} className="w-10 sm:w-20" />
                        </div>
                        <div className="flex text-white relative items-center ml-auto mr-4">
                            <Button size="sm" onClick={() => skipTime(-10)} className="text-xs p-2 bg-transparent border-none" variant="outline">
                                <UndoDot className="w-6 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => skipTime(10)} className="text-xs p-2 bg-transparent border-none" variant="outline">
                                <RedoDot className="w-6 h-4" />
                            </Button>
                            <Button onClick={() => { setIsOpen(!isOpen); setIsOpen1(false) }} className="bg-transparent border-none p-0 sm:p-2" size="sm" variant="outline">
                                {currentQuality !== -1 ? qualities && qualities[currentQuality]?.height + "p" : "Auto"}
                                <ChevronUp className="w-4 h-4 inline-block" />
                            </Button>
                            <div className={cn("rounded-sm py-1 px-2 absolute ml-20 bottom-5 md:bottom-7 lg:bottom-18 bg-gray-900/70 text-white hidden", isOpen && "flex flex-col items-center")}>
                                <Button variant="outline" onClick={() => { setCurrentQuality(-1); changeQuality(-1); setIsOpen(!isOpen) }} className={cn("bg-transparent hover:bg-primary/10 w-full border-none leading-none text-xs", currentQuality == -1 && "bg-white text-secondary")}>Auto</Button>
                                <Separator />
                                {qualities?.map((q, i) => <Button variant="outline" size="sm" onClick={() => { setCurrentQuality(i); changeQuality(i); setIsOpen(!isOpen) }} key={i} className={cn("bg-transparent hover:bg-primary/20 w-full border-none leading-none text-xs py-0", currentQuality == i && "bg-white text-secondary")}>{q.height}p</Button>)}
                            </div>
                            <Button size="sm" variant="ghost" className={cn(selectedTrack != "off" && "text-secondary")} onClick={() => { setIsOpen1(!isOpen1); setIsOpen(false) }}>
                                <Subtitles className="inline-block w-4 sm:w-6" />
                            </Button>
                            <div className={cn("w-fit h-36 overflow-y-scroll no-scrollbar rounded-sm px-2 py-1 absolute bottom-10 right-4 lg:bottom-16 bg-gray-900/70 text-white hidden", isOpen1 && " flex flex-col items-center")}>
                                <Button variant="outline" onClick={() => { setIsOpen1(!isOpen1); setSelectedTrack("off") }} className="bg-transparent hover:bg-primary/10 w-full border-none leading-none text-xs">Off</Button>
                                <Separator />
                                {captions?.map((c, i) => <Button variant="outline" size="sm" onClick={() => { setIsOpen1(!isOpen1); setSelectedTrack(i) }} key={c.label} className={cn("bg-transparent hover:bg-secondary/20 w-full border-none leading-none text-xs p-1", selectedTrack == i && "text-secondary bg-white")}>{c.label}</Button>)}
                            </div>
                            <Button onClick={() => setIsFullScreen(!isFullScreen)} size="sm" className="p-2 bg-transparent border-none" variant="outline">
                                {isFullScreen && <Minimize className='w-4 sm:w-6' />}
                                {!isFullScreen && <Fullscreen className='w-4 sm:w-6' />}
                            </Button>
                        </div>

                    </div>

                </div>
            </div>

        </div >
    )
}

export default VideoPlayer
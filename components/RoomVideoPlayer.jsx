import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Pause,
  Play,
  RedoDot,
  Subtitles,
  UndoDot,
  Fullscreen,
  Minimize,
  Volume,
  Volume1,
  Volume2,
  SkipForward,
  RefreshCcw,
} from "lucide-react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { debounce, throttle } from "lodash";
import { Separator } from "./ui/separator";
import { Kanit } from "next/font/google";
const kanit = Kanit({
  weight: ["500"],
  style: "normal",
  subsets: ["latin"],
});
const RoomVideoPlayer = ({
  Url,
  tracks,
  type,
  intro,
  outro,
  continueWatchTime,
  roomPlaying,
  isHost,
  roomId,
  chatOpen,
}) => {
  const player = useRef();
  const [showControls, setShowControls] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [playing, setPlaying] = useState(roomPlaying);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [volume, setVolume] = useState(0.9);
  const progressIntervalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  let controlsTimeout;
  let cursorTimeout;
  const [captions, setCaptions] = useState(null);
  const [captionsToUse, setCaptionsToUse] = useState([]);
  const [currentCaptions, setCurrentCaptions] = useState([]);

  useEffect(() => {
    const defaultTrackIndex = tracks?.findIndex((track) => track.default);
    setCaptions(
      tracks
        ?.filter((track) => track.kind === "captions")
        .map((track, index) => ({
          src: track.file,
          label: track.label,
          default: track.default || false,
          index: index,
        }))
    );
    setSelectedTrack(defaultTrackIndex !== -1 ? defaultTrackIndex : 0);
  }, [tracks]);
  async function fetchSubtitleFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch subtitle file");
      }
      const vttContent = await response.text();
      return vttContent;
    } catch (error) {
      console.error("Error fetching subtitle file:", error);
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
      if (line.includes("-->")) {
        // If the line contains a timestamp, create a new cue object
        const [startTimeStr, endTimeStr] = line.split(" --> ");
        const startTime = timeStrToSeconds(startTimeStr.trim());
        const endTime = timeStrToSeconds(endTimeStr.trim());
        cue = { startTime, endTime, text: "" };
      } else if (cue && line.trim() !== "") {
        // If the line is not empty and a cue object exists, add the line to the cue's text
        if (cue.text !== "") {
          cue.text += "\n"; // Add newline if this isn't the first line of text
        }
        cue.text += line.trim();
      } else if (cue && line.trim() === "") {
        // If the line is empty and a cue object exists, push the cue object to the subtitles array
        subtitles.push(cue);
        cue = null; // Reset cue object
      }
    }
    return subtitles;
  }
  function timeStrToSeconds(timeStr) {
    const parts = timeStr.split(":").map(parseFloat);
    let seconds = 0;
    if (parts.length === 3) {
      // Format: HH:MM:SS.mmm
      seconds += parts[0] * 3600; // Hours to seconds
      seconds += parts[1] * 60; // Minutes to seconds
      seconds += parts[2]; // Seconds
    } else if (parts.length === 2) {
      // Format: MM:SS.mmm or SS.mmm
      if (timeStr.includes(":")) {
        // Format: MM:SS.mmm
        seconds += parts[0] * 60; // Minutes to seconds
        seconds += parts[1]; // Seconds
      } else {
        // Format: SS.mmm
        seconds += parts[0]; // Seconds
      }
    }
    return seconds;
  }
  useEffect(() => {
    if (selectedTrack == "off" || !captions || !captions[selectedTrack]) return;
    fetchSubtitleFile(captions[selectedTrack].src).then((vttContent) => {
      if (vttContent) {
        const cap = parseVTT(vttContent);
        setCaptionsToUse(cap);
      }
    });
  }, [selectedTrack, captions]);
  const stripHtmlTags = (text) => {
    return text.replace(/<[^>]+>/g, ""); // Remove all HTML tags, keeping \n intact
  };
  const updateRoom = async () => {
    if (isHost) {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentTime: currentTime + 1, playing, roomId }),
      });
      const data = await response.json();
      if (data.status != 201) {
        console.log(data.body.message);
      }
    }
  };
  const SyncTime = async () => {
    const response = await fetch("/api/room", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, isHost, currentTime }),
    });
    const data = await response.json();
    if (data.status != 201) {
      console.log(data.body.message);
    } else {
      if (!isHost) {
        player.current.seekTo(data.body.newCurrentTime);
        setCurrentTime(data.body.newCurrentTime);
      }
    }
  };
  useEffect(() => {
    if (isHost) debouncedUpdateRoom();
  }, [playing]);
  useEffect(() => {
    if (!isHost) {
      setPlaying(roomPlaying);
    }
  }, [roomPlaying]);
  useEffect(() => {
    if (!isHost) {
      player.current.seekTo(continueWatchTime);
      setCurrentTime(continueWatchTime);
    }
  }, [continueWatchTime]);
  useEffect(() => {
    if (selectedTrack == "off") return;
    const caption = captionsToUse?.find(
      (caption) =>
        caption.startTime <= currentTime && currentTime <= caption.endTime
    );
    if (caption) {
      const combineCaptions = stripHtmlTags(caption.text);
      const splitCaptions = combineCaptions.split("\n");
      setCurrentCaptions(splitCaptions);
    } else {
      setCurrentCaptions([]);
    }
  }, [currentTime, captionsToUse]);
  useEffect(() => {
    return () => {
      clearInterval(progressIntervalRef.current);
    };
  }, []);
  // Event Listerners:
  useEffect(() => {
    const p = document.querySelector("#player");
    const pA = document.querySelector("#playerAbsolute");

    if (!p) return;
    const handleKeyDown = (e) => {
      if (!isHost || chatOpen) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          setPlaying((prevPlaying) => !prevPlaying);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        default:
          break;
      }
    };
    const handleDoubleClick = () => {
      if (p && !document.fullscreenElement) {
        p.requestFullscreen();
        setIsFullScreen(true);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    };
    const handleClick = () => {
      setShowControls((prevShowControls) => !prevShowControls);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      setShowCursor((prevShowCursor) => !prevShowCursor);
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 5000);
    };
    const handleTap = (e) => {
      e.preventDefault();
      setShowControls((prevShowControls) => !prevShowControls);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    };
    const handleMouseMove = () => {
      clearTimeout(controlsTimeout);
      setShowControls(true);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      clearTimeout(cursorTimeout);
      setShowCursor(true);
      cursorTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 5000);
    };
    if (!chatOpen) {
      document.body.addEventListener("keydown", handleKeyDown);
    }
    pA.addEventListener("dblclick", handleDoubleClick);
    pA.addEventListener("click", handleClick);
    pA.addEventListener("touchend", handleTap);
    p.addEventListener("mousemove", handleMouseMove);
    p.addEventListener("mouseleave", () => {
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    });

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
      pA.removeEventListener("dblclick", handleDoubleClick);
      pA.removeEventListener("click", handleClick);
      pA.removeEventListener("touchend", handleTap);
      p.addEventListener("mousemove", handleMouseMove);
      p.addEventListener("mouseleave", () => {
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          setShowControls(false);
        }, 1000);
      });
    };
  }, [chatOpen]);
  useEffect(() => {
    const internalPlayer =
      player.current && player.current.getInternalPlayer(type);
    if (internalPlayer && internalPlayer.currentLevel !== undefined) {
      internalPlayer.currentLevel = -1;
    }
    player?.current?.seekTo(continueWatchTime);
  }, []);
  useEffect(() => {
    const videoElement = document.querySelector("#player");
    if (videoElement && !showCursor) {
      videoElement.style.cursor = "none";
    } else {
      videoElement.style.cursor = "auto";
    }
  }, [showCursor]);
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

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);
  useEffect(() => {
    const p = document.querySelector("#player");
    if (p && !document.fullscreenElement) {
      isFullScreen && p.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);
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
    player.current.seekTo(player.current.getCurrentTime() + time);
  };
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours =
      hours > 0 ? hours.toString().padStart(2, "0") + ":" : "";
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  }
  const debouncedUpdateRoom = debounce(updateRoom, 500); // Adjust debounce time as needed
  const seekdebouncedUpdateRoom = debounce(updateRoom, 1000); // Adjust debounce time as needed

  const handleProgress = throttle((progress) => {
    setCurrentTime(progress.playedSeconds);
    setLoadedTime(progress.loadedSeconds);
    setDuration(player?.current?.getDuration());
    const newTime = progress.playedSeconds;
    setCurrentTime(newTime);
    if (isHost && Math.abs(newTime - lastUpdateTime) >= 30) {
      setLastUpdateTime(newTime);
      debouncedUpdateRoom();
    }
  }, 1000);
  const handleDuration = (duration) => {
    setDuration(duration);
    progressIntervalRef.current = setInterval(() => {
      if (player.current && player.current.getCurrentTime) {
        setCurrentTime(player.current.getCurrentTime());
      }
    }, 1000);
  };
  const handleSeek = (value) => {
    value = value[0];
    if (player.current) {
      player.current.seekTo(value);
      setCurrentTime(value);
      seekdebouncedUpdateRoom();
    }
  };
  return (
    <div
      id="player"
      className={cn("z-0 relative w-full h-full flex-1 aspect-video")}>
      <div id="playerAbsolute" className="z-10 absolute h-[85%] w-full"></div>
      <ReactPlayer
        ref={player}
        volume={volume}
        playing={playing}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={() => {
          setTotalTime(player?.current.getDuration());
          player.current.seekTo(continueWatchTime);
        }}
        url={Url}
        controls={false}
        config={{
          file: {
            attributes: { crossOrigin: "true" },
            forceHLS: true,
            hlsOptions: {
              maxBufferSize: 50 * 1024 * 1024, // Larger buffer size
              maxBufferLength: 60, // Buffer 60 seconds ahead
              liveSyncDuration: 5, // Adjust for better live sync
              startLevel: 0, // Automatically choose the best level
              autoStartLoad: true, // Start loading immediately
              enableWorker: true, // Enable HLS.js worker for performance
            },
          },
        }}
        className={cn("md:w-full focus:outline-none max-h-full object-center ")}
        width="100%"
        height="100%"
      />
      {isHost && (
        <div className="z-30 absolute bottom-20 right-2 w-fit ml-auto mr-2 ">
          <Button
            onClick={() => player.current.seekTo(intro.end)}
            variant="outline"
            className={cn(
              "drop-shadow-lg shadow-lg cursor-pointer hover:bg-transparent bg-secondary/20 border-white hidden  mb-1",
              currentTime >= intro?.start &&
                currentTime <= intro?.end &&
                currentTime != 0 &&
                "flex"
            )}>
            Skip
            <SkipForward />
          </Button>
          <Button
            onClick={() => player.current.seekTo(outro.end)}
            variant="outline"
            className={cn(
              "drop-shadow-lg shadow-lg cursor-pointer hover:bg-transparent bg-secondary/20 border-white hidden  mb-1",
              currentTime >= outro?.start &&
                currentTime <= outro?.end &&
                currentTime != 0 &&
                "flex"
            )}>
            Skip
            <SkipForward />
          </Button>
        </div>
      )}
      <div
        className={cn(
          "absolute w-full bottom-5 sm:bottom-10 lg:bottom-14 flex flex-col items-center",
          showControls && "bottom-8 sm:bottom-20 lg:bottom-24",
          kanit.className
        )}>
        {selectedTrack !== "off" && currentCaptions.length > 0 ? (
          currentCaptions.map((c, i) => {
            return (
              <p
                key={i}
                className="sm:textStroke sm:font-semibold font-sans text-white bg-black/50 sm:bg-black/40 px-1 mx-auto mb-[3px] sm:mb-[5px] text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center w-fit lg:max-w-[95%] max-w-[98%] ">
                {c}
              </p>
            );
          })
        ) : (
          <></>
        )}
      </div>
      {isHost && (
        <Button
          onClick={() => setPlaying(!playing)}
          className={cn(
            "z-20 inset-x-1/3 inset-y-1/3 absolute inline-block opacity-100 text-white bg-black bg-opacity-50 rounded-full w-fit mx-auto my-auto py-1 px-4 sm:px-8 sm:py-2",
            !showControls &&
              !isOpen &&
              !isOpen1 &&
              "hidden opacity-0 transition-opacity ease-out"
          )}
          size="lg"
          variant="ghost">
          {playing ? (
            <Pause className="max-w-6 max-h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
      )}

      <div
        className={cn(
          "w-full absolute opacity-100 block bottom-0 z-20 bg-black/20",
          !showControls &&
            !isOpen &&
            !isOpen1 &&
            "opacity-0 hidden transition-opacity ease-out"
        )}>
        <div className="mb-2 relative pb-1 flex items-center justify-around max-w-full font-semibold text-xs text-white textStrokeSmall pt-2 overflow-hidden">
          <p>{currentTime ? formatTime(currentTime) : "00:00:00"}</p>
          <Slider
            value={isHost ? [currentTime] : [100]}
            isHost={isHost}
            disabled={!isHost}
            min={0}
            max={isHost ? duration : 100}
            loadedTime={(loadedTime / player?.current?.getDuration()) * 100}
            onValueChange={(e) => handleSeek(e)}
            step={1}
            className="w-[90%]"
          />
          <p>
            {player?.current?.getDuration()
              ? formatTime(player?.current?.getDuration())
              : "00:00:00"}
          </p>
        </div>
        <div className="flex items-center gap-0 lg:gap-2 ">
          {isHost && (
            <div className="lg:ml-5 text-white">
              <Button
                onClick={() => setPlaying(!playing)}
                className="hidden sm:inline-block p-2 bg-transparent border-none"
                variant="outline">
                {playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
          <div className="relative ml-1 text-white flex items-center">
            {volume == 0 && <Volume />}
            {volume > 0 && volume <= 0.5 && <Volume1 />}
            {volume > 0.5 && <Volume2 />}
            <Slider
              volumeBar={true}
              value={[volume]}
              min={0}
              max={1}
              onValueChange={(e) => {
                setVolume(e);
              }}
              step={0.1}
              className="w-10 sm:w-20"
            />
          </div>
          <div className="flex text-white relative items-center ml-auto mr-4">
            {isHost && (
              <Button
                size="sm"
                onClick={() => skipTime(-10)}
                className="text-xs p-2 bg-transparent border-none"
                variant="outline">
                <UndoDot className="w-6 h-4" />
              </Button>
            )}
            {isHost && (
              <Button
                size="sm"
                onClick={() => skipTime(10)}
                className="text-xs p-2 bg-transparent border-none"
                variant="outline">
                <RedoDot className="w-6 h-4" />
              </Button>
            )}
            {
              <Button
                size="sm"
                onClick={() => SyncTime()}
                className="text-xs p-2 bg-transparent border-none"
                variant="outline">
                <RefreshCcw className="w-6 h-6" />
              </Button>
            }
            {captions?.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className={cn(selectedTrack != "off" && "text-secondary")}
                onClick={() => {
                  setIsOpen1(!isOpen1);
                  setIsOpen(false);
                }}>
                <Subtitles className="inline-block w-4 sm:w-6" />
              </Button>
            )}
            {captions?.length > 0 && (
              <div
                className={cn(
                  "w-fit h-36 overflow-y-scroll no-scrollbar rounded-sm px-2 py-1 absolute bottom-10 right-8 lg:bottom-16 bg-gray-900/70 text-white hidden",
                  isOpen1 && " flex flex-col items-center"
                )}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen1(!isOpen1);
                    setSelectedTrack("off");
                  }}
                  className="bg-transparent hover:bg-primary/10 w-full border-none leading-none text-xs">
                  Off
                </Button>
                <Separator />
                {captions?.map((c, i) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsOpen1(!isOpen1);
                      setSelectedTrack(i);
                    }}
                    key={c.label}
                    className={cn(
                      "bg-transparent hover:bg-secondary/20 w-full border-none leading-none text-xs p-1",
                      selectedTrack == i && "text-secondary bg-white"
                    )}>
                    {c.label}
                  </Button>
                ))}
              </div>
            )}
            <Button
              onClick={() => setIsFullScreen(!isFullScreen)}
              size="sm"
              className="p-2 bg-transparent border-none"
              variant="outline">
              {isFullScreen && <Minimize className="w-4 sm:w-6" />}
              {!isFullScreen && <Fullscreen className="w-4 sm:w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomVideoPlayer;

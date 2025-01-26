"use client";
import React, { useEffect, useState } from "react";
import { getAnimeEpisodeServerLink } from "@/app/api/getAnimeEpisodeServers";
import LiveChat from "@/components/LiveChat";
import RoomVideoPlayer from "@/components/RoomVideoPlayer";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/page";
import { cn } from "@/lib/utils";
import { ArrowLeftFromLineIcon, Copy, Eye, Loader } from "lucide-react";
import { Bebas_Neue, Oswald } from "next/font/google";
import {  useRouter } from "next/navigation";
const oswald = Oswald({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const bebas_nueue = Bebas_Neue({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const Cinema = ({ params: { roomId } }) => {
  const router = useRouter();
  let storedUser;
  if (typeof window !== "undefined") {
    storedUser = window.localStorage.getItem("user");
  }
  let { user } = useAppContext();
  const [roomData, setRoomData] = useState(null);
  const [host, setHost] = useState(null);
  const [serverLoading, setServerLoading] = useState(null);
  const [episodeServerLink, setEpisodeServerLink] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  // const pathname = usePathname();
  const authenticateUser = () => {
    if (host?._id == user?._id || !roomData?.passkey) {
      return true;
    } else {
      if (typeof window !== "undefined") {
        const storedRoomId = sessionStorage.getItem(roomId);
        if (storedRoomId) {
          return true;
        }
      }
      return false;
    }
  };
  const addUserToRoom = async () => {
    if (user) {
      const userId = user._id;
      const response = await fetch("/api/roomuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId }),
      });
      const data = await response.json();
      if (data.status != 201) {
        console.log(data.body.message);
      } else {
        const updatedRoom = data.body.room;
        setRoomData(updatedRoom);
      }
    }
  };
  const removeUserFromRoom = async () => {
    if (user && roomData) {
      const userId = user._id;
      const response = await fetch("/api/roomuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId }),
      });
      const data = await response.json();
      if (data.status != 201) {
        console.log(data.body.message);
      } else {
        console.log("Removed User");
      }
    }
  };
  const fetchEpServerLink = async () => {
    setServerLoading(true);
    await getAnimeEpisodeServerLink(
      roomData?.anime?.epId,
      "hd-1",
      roomData?.anime?.category
    ).then((res) => setEpisodeServerLink(res));
    setServerLoading(false);
  };
  const getRoomData = async () => {
    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    const data = await response.json();
    if (data.status != 201) {
      router.push(`/home`);
    } else {
      setHost(data.body.room.host);
      setRoomData(data.body.room);
    }
  };
  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
  };
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Triggered when the user is about to leave the page
      event.preventDefault();
      removeUserFromRoom();
      event.returnValue = ""; // Necessary for some browsers to show a confirmation dialog
    };

    const handleUnload = () => {
      // Triggered when the tab or window is closed
      removeUserFromRoom();
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      removeUserFromRoom();
    };
  }, []);

  useEffect(() => {
    if (!roomId && !storedUser) return router.push("/home");
    getRoomData();

    const handleBeforeUnload = (event) => {
      // Triggered when the user is about to leave the page
      event.preventDefault();
      event.returnValue = ""; // Necessary for some browsers to show a confirmation dialog
      removeUserFromRoom();
    };

    const handleUnload = () => {
      // Triggered when the tab or window is closed
      removeUserFromRoom();
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    let eventSource;
    let retryTimeout = 1000; // Initial retry timeout (1 second)

    const connect = () => {
      eventSource = new EventSource(`/api/room?roomId=${roomId}`);

      eventSource.onopen = () => {
        console.log("SSE connection established.");
        retryTimeout = 1000; // Reset retry timeout
      };

      eventSource.onmessage = (event) => {
        const change = JSON.parse(event.data);

        if (change.operationType === "update") {
          const updatedRoomData = change.fullDocument;
          setRoomData((prev) => ({ ...prev, ...updatedRoomData }));
        } else if (change.operationType === "delete") {
          alert("This room has been deleted.");
          setRoomData(null);
          router.push("/home");
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection lost. Attempting to reconnect...");
        eventSource.close();
        setTimeout(connect, retryTimeout);
        retryTimeout = Math.min(retryTimeout * 2, 30000); // Exponential backoff, max 30 seconds
      };
    };

    connect();

    return () => {
      // Cleanup on component unmount
      if (eventSource) eventSource.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [roomId, user]);
  useEffect(() => {
    if (roomData && !user) {
      return router.push(`/home`);
    }
    addUserToRoom();
  }, [user]);
  useEffect(() => {
    if (host) {
      const res = authenticateUser();
      if (!res) {
        return router.push("/home");
      }
      fetchEpServerLink();
    }
  }, [host, user]);

  return roomData ? (
    <div className="lg:pl-1 flex-grow-0 flex flex-col mt-10 sm:mt-16">
      <div className="w-full flex items-center justify-between mb-2 px-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              removeUserFromRoom();
              router.back();
            }}
            variant="outline"
            className="px-2 py-1 font-semibold text-red-800 text-xs sm:opacity-90 sm:hover:opacity-100">
            <ArrowLeftFromLineIcon className="w-4 mr-1" />
            Leave
          </Button>
          <h1 className={cn("", oswald.className)}>{host?.username}'s Room</h1>
        </div>
        <span className="flex items-center space-x-1">
          <Eye className="w-4 text-red-500" />
          <p className="text-sm">{roomData?.users?.length}</p>
        </span>
      </div>
      <div className="relative flex flex-col">
        <div className="flex gap-2 flex-col lg:flex-row">
          <div className="flex-grow mb-2 lg:mb-0 max-h-[90vh] bg-black lg:min-w-[75vw] px-2 py-4 sm:p-0 aspect-video lg:aspect-[400/300] flex-1">
            {serverLoading && (
              <Loader className="mx-auto relative top-1/2 h-8 w-8 animate-spin text-primary" />
            )}
            {!serverLoading && (
              <RoomVideoPlayer
                Url={episodeServerLink?.sources[0]?.url}
                tracks={episodeServerLink?.tracks}
                type={
                  episodeServerLink?.sources &&
                  episodeServerLink?.sources[0]?.type
                }
                outro={episodeServerLink?.outro}
                intro={episodeServerLink?.intro}
                continueWatchTime={roomData?.currentTime}
                roomPlaying={roomData?.playing}
                isHost={host?._id == user?._id}
                roomId={roomId}
                chatOpen={chatOpen}
              />
            )}
          </div>
          <LiveChat
            roomMessages={roomData?.messages}
            users={roomData?.users}
            username={user?.username}
            roomId={roomId}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
          />
        </div>
      </div>
      <h1
        className={cn(
          "text-2xl md:text-3xl font-bold ml-2 mt-2",
          bebas_nueue.className
        )}>
        {roomData?.anime.name + " - EP" + roomData?.anime.epNo}
      </h1>
      <div className="w-full mt-2 flex flex-col items-center sm:flex-row sm:justify-around">
        <div className="flex items-center space-x-1 font-bold">
          <p>Link:</p>
          <span className="flex items-center text-sm">
            <p>{window?.location.href}</p>
            <Button
              variant="ghost"
              onClick={handleCopyUrl}
              className="data-[on]:text-secondary">
              <Copy className={cn("hover:text-primary")} />
            </Button>
          </span>
        </div>
        {roomData.passkey && (
          <div className="flex items-center space-x-1 font-bold">
            <p>Passkey:</p>
            <span className="flex items-center">
              <p>{roomData.passkey}</p>
              <Button
                variant="ghost"
                onClick={handleCopyUrl}
                className="data-[on]:text-secondary">
                <Copy className={cn("hover:text-primary")} />
              </Button>
            </span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loader className="mx-auto relative top-48 h-12 w-12 animate-spin text-primary" />
  );
};

export default Cinema;

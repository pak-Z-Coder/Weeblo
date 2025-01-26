"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Lock, Unlock, DoorOpen, Eye, DoorClosed } from "lucide-react";
import Link from "next/link";
import { Bakbak_One, Bebas_Neue } from "next/font/google";
import { useRouter } from "next/navigation";
import InputOTPForm from "./InputOTP";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
const bebas_nueue = Bebas_Neue({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const RoomCard = ({ room, userId }) => {
  const router = useRouter();
  const { _id, host, anime, createdAt } = room;
  const { name, epNo, category, poster } = anime;
  const roomPassKey = room?.passkey;
  const [timeLeft, setTimeLeft] = useState("");
  const [error, setError] = useState(false);
  const [passkey, SetPasskey] = useState(null);
  // const formatCreatedAt = (timestamp) => {
  //   const date = new Date(timestamp);
  //   return date.toLocaleTimeString(); // Converts to user's local time zone
  // };
  const calculateTimeLeft = () => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const timeElapsed = (now - createdAtDate) / 1000;
    const remainingTime = Math.max(21600 - timeElapsed, 0);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = Math.floor(remainingTime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };
  const checkPasskey = () => {
    if (passkey == roomPassKey) {
      if (typeof window == "undefined") return;
      sessionStorage.setItem(`${_id}`, JSON.stringify(_id));
      return router.push(`/room/${_id}`);
    } else {
      setError(true);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);
  useEffect(() => {
    if (!passkey) return;
    checkPasskey();
  }, [passkey]);
  return (
    <Card className="w-[16rem] h-fit rounded-lg overflow-hidden space-y-1">
      <div
        style={{ backgroundImage: `url(${poster})` }}
        className={cn(
          "relative bg-cover md:h-[50%] flex items-center justify-center z-0"
        )}>
        <div className="absolute inset-0 h-full rounded-lg bg-gradient-to-b from-gray-200/0 via-gray-900/20 hover:via-gray-900/50 to-gray-950/70 hover:to-gray-950/90 z-10"></div>
        <div className="absolute inset-0 h-full backdrop-blur-sm z-10"></div>
        <div className="absolute z-20 top-1 left-2">
          <p className="md:text-lg opacity-70 font-semibold ">EP{epNo}</p>
        </div>
        <div className="absolute z-20 bottom-1 right-2">
          <p className="md:text-lg opacity-70 font-semibold ">
            {roomPassKey ? (
              <Lock className="w-4" />
            ) : (
              <Unlock className="w-4" />
            )}
          </p>
        </div>
        <div className="absolute z-20 top-1 right-2">
          <p className="md:text-lg opacity-70 font-semibold ">
            {category.toUpperCase()}
          </p>
        </div>
        <img
          alt="Poster"
          className="bg-transparent aspect-[300/400] max-w-[100px] max-h-[200px] z-20 rounded-sm drop-shadow-md object-contain object-center"
          height="400"
          src={poster}
          width="300"
          layout="responsive"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 flex items-center justify-center"></div>
      </div>
      <CardContent className="flex-1 flex-col space-y-4 pb-1">
        <div className="flex items-center justify-center">
          <h3
            className={cn(
              "text-lg md:text-xl font-bold line-clamp-1",
              bebas_nueue.className
            )}>
            {name}
          </h3>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <Avatar className="drop-shadow-lg w-6 h-6 select-none ">
                <AvatarImage alt={host?.username[0]} />
                <AvatarFallback className="text-[1rem] font-medium text-wrap ">
                  {host?.username[0]}
                </AvatarFallback>
              </Avatar>
              <p
                className={cn(
                  "text-xs md:leading-3 font-semibold",
                  bakbak_one.className
                )}>
                {host.username}
              </p>
            </div>
            <div>
              <span className="text-xs flex items-center space-x-1 opacity-90 font-bold">
                <Eye className="w-4" />
                <p>{room?.users.length}</p>
              </span>
            </div>
          </div>
          {(!roomPassKey || userId == host._id) && (
            <Link href={`/room/${_id}`} className="w-fit">
              <Button variant="ghost" className="bg-primary/20">
                <DoorOpen />
              </Button>
            </Link>
          )}
          {roomPassKey && userId !== host._id && (
            <Dialog>
              <DialogTrigger>
                <Button variant="ghost" className="bg-primary/20">
                  <DoorClosed className="hover:text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="py-2 pl-0 sm:pr-0 flex items-center justify-center">
                <InputOTPForm
                  SetPasskey={SetPasskey}
                  loading={false}
                  error={error}
                  path="rooms"
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex items-center space-x-1 justify-end w-full">
          <p className="text-xs opacity-80">Expiring in:</p>
          <p className="text-xs opacity-80 text-yellow-500">{timeLeft}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;

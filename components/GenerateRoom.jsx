"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LoaderCircle,
  LockKeyhole,
  LockKeyholeOpen,
  Popcorn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import InputOTPForm from "@/components/InputOTP";
const GenerateRoom = ({ name, epNo, epId, category, poster, host }) => {
  const router = useRouter();
  const [passkey, SetPasskey] = useState(null);
  const [secure, setSecure] = useState(false);
  const [loading, setLoading] = useState(false);
  const generateRoom = async () => {
    const anime = { name, epNo, poster, epId, category };
    try {
      setLoading(true);
      const response = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, anime, passkey }),
      });
      const data = await response.json();
      if (data.status != 201) {
        throw new Error(data.body.message);
      } else {
        setLoading(false);
        router.push(`/room/${data.body.roomId}`);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (!passkey) return;
    generateRoom();
  }, [passkey]);
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost">
            <Popcorn className="hover:text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent className="py-2 w-full sm:w-fit pr-0 flex items-center justify-center">
          <div className="flex flex-col p-2 space-y-3">
            <h2 className="text-lg font-bold text-gray-400">Cinema Room</h2>
            <div className="grid grid-cols-3 gap-x-3 text-secondary">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-sm font-semibold">EP{epNo}</p>
              <p className="text-sm font-semibold">{category.toUpperCase()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleGroup
                defaultValue={false}
                type="single"
                value={secure}
                onValueChange={(e) => {
                  setSecure(e);
                }}>
                <ToggleGroupItem
                  value={false}
                  aria-label="Original"
                  className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                  <LockKeyholeOpen />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={true}
                  aria-label="Original"
                  className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                  <LockKeyhole />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {secure && (
              <div className="flex items-center justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <InputOTPForm SetPasskey={SetPasskey} loading={loading} />
                </div>
              </div>
            )}
            {!secure && (
              <div>
                <Button
                  className="flex ml-auto items-center gap-1 hover:text-primary"
                  variant="ghost"
                  type="submit"
                  onClick={generateRoom}>
                  <p className="text-xs font-bold">Create Cinema</p>
                  {loading ? (
                    <LoaderCircle className="w-4 animate-spin" />
                  ) : (
                    <Popcorn className="w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateRoom;

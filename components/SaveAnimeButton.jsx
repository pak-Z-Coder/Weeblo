import { useAppContext } from "@/context/page";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkX, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const SaveAnimeButton = ({ animeId, name, poster, type }) => {
  let { user, setUser } = useAppContext();
  const [saved, setSaved] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorSaving, setErrorSaving] = useState(false);
  const saveAnime = async () => {
    try {
      setSaveLoading(true);
      const response = await fetch("/api/savedAnime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email, animeId, name, poster }),
      });
      const data = await response.json();
      if (data.status == 200) {
        setUser((prevUser) => {
          return {
            ...prevUser,
            savedAnime: [...prevUser.savedAnime, { animeId, name, poster }],
          };
        });
        setSaved(true);
        setErrorSaving(false);
        setSaveLoading(false);
      } else if (data.status == 201) {
        setUser((prevUser) => {
          return {
            ...prevUser,
            savedAnime: prevUser.savedAnime.filter(
              (anime) => anime.animeId !== animeId
            ),
          };
        });
        setSaved(false);
        setErrorSaving(false);
        setSaveLoading(false);
      } else {
        throw new Error(data.body.message);
      }
    } catch (error) {
      setSaveLoading(false);
      setErrorSaving(true);
      console.log(error.message);
    }
  };
  const checkIfSavedAnime = async () => {
    if (user?.savedAnime?.some((anime) => anime.animeId === animeId)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  };
  useEffect(() => {
    checkIfSavedAnime();
  }, []);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div>
            {user && (
              <Button className={cn("z-30 bg-transparent hover:bg-transparent")} onClick={saveAnime}>
                {saveLoading ? (
                  <Loader2 className="w-4 animate-spin" />
                ) : type != "Saved" ? (
                  <Bookmark
                    className={cn("max-w-7  fill-gray-100/50", saved && "fill-secondary")}
                  />
                ) : (
                  <BookmarkX className="max-w-7 " />
                )}
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{saved ? "Remove" : "Save"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SaveAnimeButton;

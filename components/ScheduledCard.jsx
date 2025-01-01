import { CardContent, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";

const ScheduledCard = ({ anime }) => {
  const { time, name, airingTimestamp, secondsUntilAiring } = anime;
  // const convertTo12HourFormat = (time) => {
  //   let [hours, minutes] = time.split(":").map(Number);

  //   // Determine AM or PM suffix
  //   const period = hours >= 12 ? "PM" : "AM";

  //   // Convert hours to 12-hour format
  //   hours = hours % 12 || 12; // '0' hours should convert to '12'

  //   // Return formatted time
  //   return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  // };
  const [timeLeft, setTimeLeft] = useState(secondsUntilAiring);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the countdown for negative values

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the interval at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };
  return (
    <Card className="h-full w-full">
      <CardContent className="p-2 pt-2 grid gap-4 mx-auto">
        <div className="grid gap-1.5">
          <div className="flex items-center">
            <div className="text-xs flex items-center">
              <p
                className={cn(
                  "text-yellow-500",
                  timeLeft <= 0 && "text-green-500"
                )}>
                <Dot />
              </p>
            </div>
            <h3 className="text-xs font-bold tracking-wide line-clamp-2">
              {name}
            </h3>
          </div>

          <div className="grid grid-cols-2">
            <h4 className="text-xs font-semibold text-secondary text-opacity-80 tracking-tight">
              {timeLeft > 0 ? <p>{formatTime(timeLeft)}</p>:"Aired"}
            </h4>
            <p className="text-xs opacity-90 font-medium text-right ">
              {new Date(airingTimestamp * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ScheduledCard;

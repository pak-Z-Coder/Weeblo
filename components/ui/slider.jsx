"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef(
  ({ className, loadedTime = 0, volumeBar, isHost, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative cursor-pointer flex w-full touch-none select-none items-center",
        className
      )}
      {...props}>
      <SliderPrimitive.Track
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full bg-white/50",
          !isHost && !volumeBar && "bg-transparent"
        )}>
        <SliderPrimitive.Range
          className={cn(
            "z-0 absolute h-full bg-white/60 ",
            !isHost && !volumeBar && "hidden"
          )}
          style={{ width: `${loadedTime}%` }}
        />
        <SliderPrimitive.Range
          className={cn(
            "z-0 absolute h-full bg-primary",
            volumeBar && "bg-secondary/50",
            !isHost && !volumeBar && "bg-red-500/90 h-1 rounded-full"
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full border-2 border-secondary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 z-10",
          volumeBar && "border-0 w-3 h-2",
          !isHost && !volumeBar && "hidden"
        )}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

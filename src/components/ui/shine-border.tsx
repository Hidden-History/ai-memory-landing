"use client";

import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  const colorStr = color instanceof Array ? color.join(",") : color;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--shine-bg": `radial-gradient(transparent, transparent, ${colorStr}, transparent, transparent)`,
        } as React.CSSProperties
      }
      className={cn(
        "shine-border-container relative grid h-full w-full place-items-center rounded-3xl p-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export { ShineBorder };

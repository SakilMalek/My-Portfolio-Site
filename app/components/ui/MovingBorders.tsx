/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
       "bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0 rounde-[1.75rem]"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(#CBACF9_40%,transparent_60%)]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  // Changed type from SVGPathElement to SVGRectElement
  const pathRef = useRef<SVGRectElement>(null);
  
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time: number) => {
    // SVGRectElement doesn't have getTotalLength, so we need to use a workaround
    if (pathRef.current) {
      // Calculate perimeter manually for the rectangle
      const rect = pathRef.current.getBBox();
      const perimeter = 2 * (rect.width + rect.height);
      
      const pxPerMillisecond = perimeter / duration;
      progress.set((time * pxPerMillisecond) % perimeter);
    }
  });

  const getPointOnRect = (distance: number) => {
    if (!pathRef.current) return { x: 0, y: 0 };
    
    const rect = pathRef.current.getBBox();
    const perimeter = 2 * (rect.width + rect.height);
    
    // Normalize distance to be within the perimeter
    const normalizedDistance = distance % perimeter;
    
    // Calculate position on rectangle
    // Top edge
    if (normalizedDistance < rect.width) {
      return { x: rect.x + normalizedDistance, y: rect.y };
    }
    // Right edge
    else if (normalizedDistance < rect.width + rect.height) {
      return { x: rect.x + rect.width, y: rect.y + (normalizedDistance - rect.width) };
    }
    // Bottom edge
    else if (normalizedDistance < 2 * rect.width + rect.height) {
      return { x: rect.x + rect.width - (normalizedDistance - (rect.width + rect.height)), y: rect.y + rect.height };
    }
    // Left edge
    else {
      return { x: rect.x, y: rect.y + rect.height - (normalizedDistance - (2 * rect.width + rect.height)) };
    }
  };

  const x = useTransform(progress, (val: number) => {
    const point = getPointOnRect(val);
    return point.x;
  });
  
  const y = useTransform(progress, (val: number) => {
    const point = getPointOnRect(val);
    return point.y;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
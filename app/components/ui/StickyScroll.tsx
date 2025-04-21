"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    img?: string;
    link?: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = ["#0f172a", "#000000", "#171717"];
  const linearGradients = useMemo(
    () => [
      "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan to emerald
      "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink to indigo
      "linear-gradient(to bottom right, #f97316, #eab308)", // orange to yellow
    ],
    []
  );

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(
      linearGradients[activeCard % linearGradients.length]
    );
  }, [activeCard, linearGradients]);
{

      return (
<section className="w-full py-3" id="certifications">
<h1 className="heading pb-10">
        My <span className="text-purple">Certifications</span>
      </h1>
      <motion.div
      animate={{
        backgroundColor:
          backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex flex-col md:flex-row h-[90vh] md:h-[35rem] overflow-y-scroll md:overflow-y-auto rounded-md p-6 md:p-10"
      ref={ref}
    >
      {/* Content Section */}
      <div className="relative flex-1 px-4">
        <div className="max-w-2xl mx-auto">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="mt-4 max-w-md text-sm md:text-base text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-44 md:h-64" />
        </div>
      </div>

      {/* Preview Section */}
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 mt-10 md:mt-0 block h-64 md:h-72 w-full max-w-xs mx-auto md:mx-0 overflow-hidden rounded-md bg-white shadow-lg",
          contentClassName
        )}
      >
        {content[activeCard].img ? (
          <div className="relative h-full w-full flex flex-col justify-end">
            {/* Image Background */}
            <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
              <Image
                src={content[activeCard].img}
                alt={content[activeCard].title}
                fill
                className="object-cover rounded-md pointer-events-none"
                sizes="(max-width: 768px) 100vw, 100%"
                priority
              />
            </div>

            {/* View Certificate Link */}
            {content[activeCard].link && (
              <div className="z-10 relative bg-gradient-to-r from-[#04071D] to-[#0C0E23] text-white text-center">
                <a
                  href={content[activeCard].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-4 text-sm font-semibold hover:text-blue-300 transition cursor-pointer"
                >
                  View Certificate
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500 p-4">
            No Preview Available
          </div>
        )}
      </div>
    </motion.div>
</section>


  );
  }


};

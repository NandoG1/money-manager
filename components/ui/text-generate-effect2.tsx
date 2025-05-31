"use client";
import { useEffect, useState, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect2 = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  threshold = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  threshold?: number; // Visibility threshold for triggering animation
}) => {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);
  let wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
          y: [20, 0], // Add a subtle upward movement
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.2),
          ease: [0.22, 1, 0.36, 1], // Smooth easing
        }
      );
    }
  }, [isInView, hasAnimated, animate, filter, duration]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="flex flex-wrap justify-center">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-gray-300 text-xl opacity-0 inline-block mr-[6px]"
              style={{
                filter: filter ? "blur(8px)" : "none",
                transform: "translateY(20px)", // Initial position before animation
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={cn("", className)}>
      <div className="mt-4">
        <div className="text-gray-300 text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

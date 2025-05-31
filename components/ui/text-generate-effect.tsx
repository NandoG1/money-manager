"use client";
import { useEffect, useState, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
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
          scale: [0.9, 1],
          y: [20, 0],
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.15),
          ease: [0.22, 1, 0.36, 1],
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
              className="text-white text-4xl font-bold opacity-0 mr-3 mb-2"
              style={{
                filter: filter ? "blur(8px)" : "none",
                transform: "translateY(20px) scale(0.9)",
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-white text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
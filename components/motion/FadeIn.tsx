"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
  amount?: number;
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.15,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });

  const y = direction === "up" ? 20 : direction === "down" ? -20 : 0;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }
          : { opacity: 0, y }
      }
    >
      {children}
    </motion.div>
  );
}

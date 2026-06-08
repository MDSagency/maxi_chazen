"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { MOTION, PREMIUM_EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
  amount?: number;
  blur?: boolean;
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.15,
  blur = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });
  const reduced = usePrefersReducedMotion();

  const y = direction === "up" ? 24 : direction === "down" ? -24 : 0;

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: MOTION.duration.reveal,
                delay,
                ease: PREMIUM_EASE,
              },
            }
          : { opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }
      }
    >
      {children}
    </motion.div>
  );
}

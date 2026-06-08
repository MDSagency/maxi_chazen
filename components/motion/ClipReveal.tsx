"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { MOTION, PREMIUM_EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ClipRevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  amount?: number;
  /** Above-the-fold content — reveal on mount, not scroll intersection */
  immediate?: boolean;
};

const clipHidden: Record<NonNullable<ClipRevealProps["direction"]>, string> = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
};

export default function ClipReveal({
  children,
  className,
  direction = "left",
  delay = 0,
  amount = 0.05,
  immediate = false,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (immediate) setMounted(true);
  }, [immediate]);

  const shouldReveal = immediate ? mounted : inView;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div
        initial={{ clipPath: clipHidden[direction] }}
        animate={
          shouldReveal
            ? {
                clipPath: "inset(0 0% 0 0)",
                transition: {
                  duration: MOTION.duration.slow,
                  delay,
                  ease: PREMIUM_EASE,
                },
              }
            : { clipPath: clipHidden[direction] }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

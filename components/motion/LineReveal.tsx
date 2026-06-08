"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { MOTION, PREMIUM_EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type LineRevealProps = {
  className?: string;
  align?: "left" | "center";
  delay?: number;
};

export default function LineReveal({
  className,
  align = "left",
  delay = 0.15,
}: LineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = usePrefersReducedMotion();

  return (
    <span
      ref={ref}
      className={cn(
        "mt-4 block h-px w-16 bg-brand-blue/70",
        align === "center" && "mx-auto",
        className,
      )}
      aria-hidden
    >
      {!reduced ? (
        <motion.span
          className="block h-full origin-left bg-brand-blue"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: MOTION.duration.base, delay, ease: PREMIUM_EASE }}
        />
      ) : null}
    </span>
  );
}

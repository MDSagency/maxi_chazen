"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { MOTION, PREMIUM_EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  id?: string;
};

export default function RevealText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  id,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      ref={ref as never}
      className={cn("flex flex-wrap gap-x-[0.28em]", className)}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-flex overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "115%", rotate: 2 }}
            animate={isInView ? { y: 0, rotate: 0 } : { y: "115%", rotate: 2 }}
            transition={{
              duration: MOTION.duration.base,
              delay: delay + index * 0.045,
              ease: PREMIUM_EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

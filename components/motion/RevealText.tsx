"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type RevealTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
};

export default function RevealText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={cn("flex flex-wrap gap-x-[0.28em]", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="overflow-hidden inline-flex">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.7,
              delay: delay + index * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

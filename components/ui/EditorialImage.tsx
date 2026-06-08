"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type EditorialImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: "portrait" | "landscape" | "square" | "hero";
  hoverZoom?: boolean;
  parallax?: boolean;
};

const aspectClass = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  hero: "aspect-[3/4] md:aspect-[4/5]",
};

export default function EditorialImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  aspect = "portrait",
  hoverZoom = false,
  parallax = false,
}: EditorialImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1.08, 1.04]);

  const enableParallax = parallax && !reduced && !isMobile;
  const enableHover = hoverZoom && !reduced;

  return (
    <div
      ref={ref}
      className={cn(
        "group/img relative overflow-hidden bg-paper",
        aspectClass[aspect],
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={enableParallax ? { y: imageY, scale: imageScale } : undefined}
        whileHover={enableHover ? { scale: 1.05 } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-center brightness-[1.03] contrast-[0.96] saturate-[0.88] transition-[filter] duration-700 group-hover/img:brightness-[1.06]"
        />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/img:opacity-100"
        aria-hidden
      />
    </div>
  );
}

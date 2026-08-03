"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { BRAND_IMAGES } from "@/lib/images";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
  priority?: boolean;
};

const sizeMap = {
  sm: { box: "h-14 w-14", width: 112, height: 112 },
  md: { box: "h-20 w-20", width: 160, height: 160 },
  lg: { box: "h-24 w-24", width: 192, height: 192 },
};

export default function BrandMark({
  size = "md",
  className,
  animated = false,
  priority = false,
}: BrandMarkProps) {
  const { box, width, height } = sizeMap[size];

  const image = (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-white",
        box,
        className,
      )}
    >
      <Image
        src={BRAND_IMAGES.logo}
        alt="Maxi Chazen"
        width={width}
        height={height}
        priority={priority}
        className="h-full w-full object-contain object-center"
        unoptimized
      />
    </div>
  );

  if (!animated) return image;

  return (
    <motion.div
      whileHover={{ opacity: 0.92 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {image}
    </motion.div>
  );
}

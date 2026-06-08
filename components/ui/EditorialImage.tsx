import Image from "next/image";
import { cn } from "@/lib/cn";

type EditorialImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: "portrait" | "landscape" | "square" | "hero";
};

const aspectClass = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  hero: "aspect-[3/4] md:aspect-[4/5]",
};

/**
 * Consistent luxury image treatment — unified aspect ratios & subtle grading.
 */
export default function EditorialImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  aspect = "portrait",
}: EditorialImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper",
        aspectClass[aspect],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center brightness-[1.03] contrast-[0.96] saturate-[0.88]"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import EditorialImage from "@/components/ui/EditorialImage";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/lib/product-images";

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <EditorialImage
        src={active.url}
        alt={active.alt || productName}
        aspect="portrait"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="luxury-shadow-deep"
      />

      {images.length > 1 ? (
        <div
          className={cn(
            "grid gap-3",
            images.length === 2
              ? "grid-cols-2"
              : images.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative overflow-hidden border-2 transition-colors",
                activeIndex === index
                  ? "border-ink"
                  : "border-transparent hover:border-line",
              )}
              aria-label={`Voir l'image ${index + 1} sur ${images.length}`}
              aria-pressed={activeIndex === index}
            >
              <EditorialImage
                src={image.url}
                alt={image.alt || `${productName} — vue ${index + 1}`}
                aspect="square"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

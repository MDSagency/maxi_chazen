import { resolveProductImage } from "@/lib/images";
import type { Product } from "@/lib/types";

export type GalleryImage = {
  url: string;
  alt: string;
};

export function getProductGallery(product: Product): GalleryImage[] {
  const name = product.name || "Produit";

  if (Array.isArray(product.images) && product.images.length > 0) {
    const normalized = product.images
      .map((item) => {
        if (typeof item === "string") {
          const url = item.trim();
          return url ? { url, alt: name } : null;
        }
        const url = item.url?.trim() ?? "";
        return url
          ? { url, alt: item.alt?.trim() || name }
          : null;
      })
      .filter((item): item is GalleryImage => item !== null);

    if (normalized.length > 0) return normalized;
  }

  return [{ url: resolveProductImage(product), alt: name }];
}

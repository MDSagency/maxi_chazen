import type { StaticImageData } from "next/image";
import babyWithMother from "./baby with mother  1.jpg";
import baby1 from "./Baby 1 .jpg";
import baby2 from "./baby 2.jpg";
import baby3 from "./baby 3.jpg";

/** Static imports from lib/ → Next.js optimized asset paths */
function asset(img: StaticImageData): string {
  return img.src;
}

/**
 * Public assets — Maxi Chazen branded product photography.
 * unnamed*.jpg = official product flat-lays & lifestyle shots.
 */
const PUBLIC = {
  /** Hi-res PNG for UI — sharp on Retina displays */
  logo: "https://res.cloudinary.com/drfntkkhe/image/upload/v1777151440/image-removebg-preview_uuol8c.png",
  logoFavicon: "/logo.jfif",
  productsFlatlay: "/images/unnamed.jpg",
  productsNursery: "/images/unnamed1.jpg",
  productBalm: "/images/unnamed2.jpg",
} as const;

/**
 * Smart visual map
 * ─────────────────────────────────────────────────────────
 * lib/baby with mother  → hero, confiance (lien parent-bébé)
 * lib/Baby 1            → produits naturels, story (routine soins)
 * lib/baby 2            → soins délicats (rituel bien-être)
 * lib/baby 3            → protection quotidienne (pureté, douceur)
 * public/unnamed.jpg    → collection complète (catégorie hygiène)
 * public/unnamed1.jpg   → ligne lotion/crème (catégorie soins)
 * public/unnamed2.jpg   → baume barrière (catégorie accessoires)
 */
export const BRAND_IMAGES = {
  logo: PUBLIC.logo,

  hero: asset(babyWithMother),

  story: asset(baby1),
  storyDetail: asset(baby3),

  editorial: {
    soinsDelicats: asset(baby2),
    produitsNaturels: asset(baby1),
    protectionQuotidienne: asset(baby3),
    confianceParentale: asset(babyWithMother),
  },

  categories: {
    soins: PUBLIC.productsNursery,
    hygiene: PUBLIC.productsFlatlay,
    accessoires: PUBLIC.productBalm,
  },

  lifestyle: {
    texture: asset(baby3),
    nursery: asset(baby2),
    productFlatlay: PUBLIC.productsFlatlay,
  },

  products: {
    collection: PUBLIC.productsFlatlay,
    nursery: PUBLIC.productsNursery,
    balm: PUBLIC.productBalm,
  },

  productFallback: PUBLIC.productsNursery,
} as const;

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  soins: BRAND_IMAGES.categories.soins,
  "soins du corps": BRAND_IMAGES.categories.soins,
  lotion: BRAND_IMAGES.products.nursery,
  crème: BRAND_IMAGES.products.nursery,
  hygiene: BRAND_IMAGES.categories.hygiene,
  hygiène: BRAND_IMAGES.categories.hygiene,
  gel: BRAND_IMAGES.categories.hygiene,
  shampoing: BRAND_IMAGES.categories.hygiene,
  accessoires: BRAND_IMAGES.categories.accessoires,
  baume: BRAND_IMAGES.products.balm,
  couche: BRAND_IMAGES.products.balm,
  corps: BRAND_IMAGES.categories.soins,
  peau: BRAND_IMAGES.categories.soins,
};

/** Resolves product image: Supabase URL → category match → branded fallback */
export function resolveProductImage(product: {
  image?: string;
  category?: string;
  name?: string;
}): string {
  const trimmed = product.image?.trim();
  if (trimmed) return trimmed;

  const key = product.category?.trim().toLowerCase() ?? "";
  const name = product.name?.trim().toLowerCase() ?? "";

  for (const [match, url] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (key.includes(match) || name.includes(match)) return url;
  }

  return BRAND_IMAGES.productFallback;
}

/** Editorial accents for product detail when only one catalog image exists */
export function productDetailAccents(category?: string): [string, string] {
  const key = category?.trim().toLowerCase() ?? "";

  if (key.includes("baume") || key.includes("couche")) {
    return [BRAND_IMAGES.products.balm, asset(baby3)];
  }
  if (key.includes("gel") || key.includes("shampoing") || key.includes("hygi")) {
    return [BRAND_IMAGES.products.collection, asset(baby2)];
  }

  return [BRAND_IMAGES.products.nursery, asset(baby1)];
}

import type { StaticImageData } from "next/image";
import babyWithMother from "./baby with mother  1.jpg";
import babyAndMother2 from "./baby and mother 2.jpg";
import babyAndParent1 from "./baby and parent 1.jpg";
import baby1 from "./Baby 1 .jpg";
import baby2 from "./baby 2.jpg";
import baby3 from "./baby 3.jpg";
import baby5 from "./baby 5.jpg";
import baby6 from "./baby 6.jpg";
import baby9 from "./baby 9.jpg";

/** Static imports from lib/ → Next.js optimized asset paths */
function asset(img: StaticImageData): string {
  return img.src;
}

/**
 * Public assets — product flat-lays for catalog fallbacks only.
 */
const PUBLIC = {
  logo: "/logo.jfif",
  logoFavicon: "/logo.jfif",
  productsFlatlay: "/images/unnamed.jpg",
  productsNursery: "/images/unnamed1.jpg",
  productBalm: "/images/unnamed2.jpg",
} as const;

/**
 * Homepage visual map (9 lib lifestyle shots — each used at least once)
 * ─────────────────────────────────────────────────────────
 * baby with mother 1  → hero
 * baby and mother 2   → histoire (main)
 * baby and parent 1   → lifestyle · confiance parentale
 * Baby 1              → histoire detail · produits naturels
 * baby 2              → lifestyle rituel · soins délicats
 * baby 3              → catégorie protection
 * baby 5              → histoire detail · lifestyle pureté
 * baby 6              → catégorie soins du corps
 * baby 9              → catégorie hygiène · protection quotidienne
 */
export const BRAND_IMAGES = {
  logo: PUBLIC.logo,

  hero: asset(babyWithMother),

  story: asset(babyAndMother2),
  storyPortrait: asset(baby1),
  storyDetail: asset(baby5),

  editorial: {
    soinsDelicats: asset(baby2),
    produitsNaturels: asset(baby1),
    protectionQuotidienne: asset(baby9),
    confianceParentale: asset(babyAndParent1),
  },

  categories: {
    soins: PUBLIC.productsNursery,
    hygiene: PUBLIC.productsFlatlay,
    accessoires: PUBLIC.productBalm,
  },

  lifestyle: {
    collection: PUBLIC.productsFlatlay,
    rituel: asset(baby2),
    famille: asset(babyAndParent1),
    purete: asset(baby5),
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
    return [BRAND_IMAGES.products.collection, asset(baby6)];
  }

  return [BRAND_IMAGES.products.nursery, asset(baby1)];
}

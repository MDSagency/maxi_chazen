import { BRAND_IMAGES } from "@/lib/images";

export const DEFAULT_WEBSITE_CONTENT = {
  hero: {
    eyebrow: "Soins premium pour bébé",
    title: "L'essentiel pour une enfance apaisée.",
    description:
      "Des soins doux, sûrs et élégants — formulés pour la peau délicate de votre bébé, avec la rigueur d'une maison de luxe.",
    ctaPrimary: "Découvrir la collection",
    ctaSecondary: "Notre histoire",
    imageUrl: BRAND_IMAGES.hero,
    stats: [
      { value: "4.9", label: "Note clients" },
      { value: "100%", label: "Testé dermatologiquement" },
      { value: "48h", label: "Livraison Algérie" },
    ],
  },
  banners: [
    {
      id: "banner-1",
      title: "Nouvelle collection",
      subtitle: "Soins délicats pour les premiers mois",
      imageUrl: BRAND_IMAGES.story,
      link: "/products",
      active: true,
    },
  ],
  histoire: {
    eyebrow: "Notre histoire",
    title: "Une maison née de la tendresse",
    paragraphs: [
      "Maxi Chazen est née d'une conviction simple : chaque bébé mérite des soins d'une pureté absolue.",
      "Nous sélectionnons chaque ingrédient avec la même exigence qu'une maison de parfumerie.",
    ],
    imageUrl: BRAND_IMAGES.story,
  },
  testimonials: [
    {
      id: "t1",
      name: "Amira B.",
      location: "Alger",
      quote:
        "Des produits d'une douceur remarquable. Ma fille a la peau sensible et ces soins lui conviennent parfaitement.",
      rating: 5,
    },
    {
      id: "t2",
      name: "Karim M.",
      location: "Oran",
      quote:
        "Livraison rapide et emballage soigné. On sent vraiment le côté premium.",
      rating: 5,
    },
  ],
  homepage_images: {
    lifestyle: [
      BRAND_IMAGES.lifestyle.collection,
      BRAND_IMAGES.lifestyle.rituel,
      BRAND_IMAGES.lifestyle.famille,
    ],
  },
  footer: {
    tagline: "Soins premium pour bébé — formulés avec douceur et rigueur.",
    copyright: "© Maxi Chazen. Tous droits réservés.",
  },
  contact: {
    email: "contact@maxichazen.dz",
    phone: "+213 555 000 000",
    address: "Alger, Algérie",
    hours: "Lun–Sam, 9h–18h",
  },
} as const;

export type WebsiteSection = keyof typeof DEFAULT_WEBSITE_CONTENT;

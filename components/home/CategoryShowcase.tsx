"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

const categories = [
  {
    title: "Soins du corps",
    description:
      "Laits, crèmes et huiles — la ligne lotion & crème Maxi Chazen pour une peau douce.",
    image: BRAND_IMAGES.categories.soins,
    alt: "Lotion et crème bébé Maxi Chazen",
    href: "/products",
  },
  {
    title: "Hygiène",
    description:
      "Shampoing, gel lavant et essentiels du bain — douceur et efficacité au quotidien.",
    image: BRAND_IMAGES.categories.hygiene,
    alt: "Collection hygiène complète Maxi Chazen",
    href: "/products",
  },
  {
    title: "Protection",
    description:
      "Baumes et soins protecteurs — formulés pour les zones les plus sensibles.",
    image: BRAND_IMAGES.categories.accessoires,
    alt: "Baume barrière Maxi Chazen avec bébé",
    href: "/products",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-surface section-editorial">
      <Container>
        <SectionHeader
          eyebrow="Catégories"
          title="Explorez nos univers"
          description="Trois collections pensées pour répondre à chaque besoin du quotidien."
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {categories.map((category, index) => (
            <FadeIn key={category.title} delay={index * 0.08}>
              <Link href={category.href} className="group block">
                <EditorialImage
                  src={category.image}
                  alt={category.alt}
                  aspect="portrait"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="mb-5 luxury-shadow transition-opacity duration-700 group-hover:opacity-90"
                />
                <p className="eyebrow mb-2">Collection</p>
                <h3 className="mb-2 font-display text-2xl text-ink md:text-[1.65rem]">
                  {category.title}
                </h3>
                <p className="mb-4 text-sm font-light leading-relaxed text-muted">
                  {category.description}
                </p>
                <span className="inline-block border-b border-ink/30 pb-0.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-500 group-hover:border-brand-blue group-hover:text-brand-blue">
                  Découvrir
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

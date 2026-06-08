"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { BRAND_IMAGES } from "@/lib/images";

const categories = [
  {
    title: "Soins du corps",
    description: "Laits, crèmes et huiles pour une peau douce et protégée.",
    image: BRAND_IMAGES.categories.soins,
    href: "/products",
  },
  {
    title: "Hygiène",
    description: "Gels lavants et soins quotidiens, doux et efficaces.",
    image: BRAND_IMAGES.categories.hygiene,
    href: "/products",
  },
  {
    title: "Accessoires",
    description: "L'essentiel du confort, pensé pour les premiers moments.",
    image: BRAND_IMAGES.categories.accessoires,
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
              <Link
                href={category.href}
                className="group relative block overflow-hidden bg-ink"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="eyebrow mb-3 text-white/50">Collection</p>
                    <h3 className="mb-3 font-display text-2xl text-white md:text-3xl">
                      {category.title}
                    </h3>
                    <p className="max-w-xs text-sm font-light leading-relaxed text-white/65">
                      {category.description}
                    </p>
                    <span className="mt-6 inline-block border-b border-white/40 pb-0.5 text-[10px] uppercase tracking-[0.22em] text-white transition-colors duration-500 group-hover:border-brand-yellow group-hover:text-brand-yellow">
                      Découvrir
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

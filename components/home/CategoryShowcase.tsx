"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import EditorialImage from "@/components/ui/EditorialImage";
import ClipReveal from "@/components/motion/ClipReveal";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { BRAND_IMAGES } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  const reduced = usePrefersReducedMotion();

  return (
    <section className="bg-surface section-editorial">
      <Container>
        <SectionHeader
          eyebrow="Catégories"
          title="Explorez nos univers"
          description="Trois collections pensées pour répondre à chaque besoin du quotidien."
          align="center"
        />

        <StaggerGroup className="grid gap-8 md:grid-cols-3 md:gap-8" stagger={0.12}>
          {categories.map((category, index) => (
            <StaggerItem key={category.title}>
              <motion.div
                whileHover={reduced ? undefined : { y: -6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={category.href} className="group block text-center md:text-left">
                  <ClipReveal direction="up" delay={index * 0.06}>
                    <EditorialImage
                      src={category.image}
                      alt={category.alt}
                      aspect="portrait"
                      hoverZoom
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="mb-5 luxury-shadow"
                    />
                  </ClipReveal>
                  <p className="eyebrow mb-2">Collection</p>
                  <h3 className="mb-2 font-display text-2xl text-ink md:text-[1.65rem]">
                    {category.title}
                  </h3>
                  <p className="mx-auto mb-5 max-w-xs text-sm font-light leading-relaxed text-muted md:mx-0">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-all duration-500 group-hover:gap-3 group-hover:border-brand-blue group-hover:text-brand-blue">
                    Découvrir
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import RevealText from "@/components/motion/RevealText";
import LineReveal from "@/components/motion/LineReveal";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { BRAND_IMAGES } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const gallery = [
  {
    src: BRAND_IMAGES.lifestyle.collection,
    alt: "Collection Maxi Chazen — essentiels de soin bébé",
    caption: "La collection",
  },
  {
    src: BRAND_IMAGES.lifestyle.rituel,
    alt: "Rituel de soin délicat pour bébé",
    caption: "Le rituel",
  },
  {
    src: BRAND_IMAGES.lifestyle.famille,
    alt: "Lien de confiance entre parent et bébé — Maxi Chazen",
    caption: "La famille",
  },
];

export default function LifestyleGallery() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rowX = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section
      ref={ref}
      className="overflow-hidden border-t border-line bg-paper py-20 md:py-28"
    >
      <Container>
        <FadeIn className="mb-12 text-center md:mb-16">
          <p className="eyebrow mb-4">Univers visuel</p>
          <LineReveal align="center" />
          <RevealText
            text="L'art du soin, au quotidien"
            as="h2"
            className="mt-6 justify-center font-display text-3xl text-ink md:text-4xl"
          />
        </FadeIn>

        <motion.div style={reduced ? undefined : { x: rowX }}>
          <StaggerGroup
            className="grid gap-5 md:grid-cols-3 md:gap-6"
            stagger={0.14}
          >
            {gallery.map((item, index) => (
              <StaggerItem key={item.caption}>
                <figure className="text-center">
                  <EditorialImage
                    src={item.src}
                    alt={item.alt}
                    aspect="portrait"
                    hoverZoom
                    parallax={index === 1}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <figcaption className="mt-4 text-[10px] uppercase tracking-[0.24em] text-muted-light">
                    {item.caption}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </motion.div>
      </Container>
    </section>
  );
}

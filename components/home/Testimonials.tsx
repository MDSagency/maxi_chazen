"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const testimonials = [
  {
    quote:
      "Des produits d'une douceur remarquable. Ma fille n'a jamais eu de réaction, et l'emballage est magnifique.",
    author: "Amira B.",
    location: "Alger",
  },
  {
    quote:
      "Enfin une marque algérienne qui rivalise avec les grandes maisons internationales. Qualité premium, livraison rapide.",
    author: "Karim M.",
    location: "Oran",
  },
  {
    quote:
      "Les formules sont légères, efficaces et rassurantes pour le quotidien. Une référence pour notre famille.",
    author: "Nadia K.",
    location: "Constantine",
  },
];

export default function Testimonials() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="border-t border-line bg-surface section-editorial">
      <Container>
        <SectionHeader
          eyebrow="Témoignages"
          title="La confiance de milliers de parents"
          description="Des avis authentiques de familles qui nous font confiance au quotidien."
          align="center"
        />

        <StaggerGroup className="grid gap-6 md:grid-cols-3 md:gap-8" stagger={0.1}>
          {testimonials.map((item) => (
            <StaggerItem key={item.author}>
              <motion.blockquote
                whileHover={
                  reduced
                    ? undefined
                    : {
                        y: -4,
                        borderColor: "rgba(0, 140, 202, 0.25)",
                      }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col border border-line bg-white p-6 text-center md:p-10 md:text-left"
              >
                <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-muted-light">
                  Note · 5/5
                </p>
                <p className="mx-auto flex-1 max-w-sm font-display text-xl font-light italic leading-[1.6] text-charcoal md:mx-0">
                  « {item.quote} »
                </p>
                <footer className="mt-10 border-t border-line pt-6">
                  <cite className="not-italic">
                    <p className="text-sm font-normal text-ink">{item.author}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-light">
                      {item.location}
                    </p>
                  </cite>
                </footer>
              </motion.blockquote>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}

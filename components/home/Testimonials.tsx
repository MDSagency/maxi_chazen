"use client";

import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";

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
  return (
    <section className="border-t border-line bg-surface section-editorial">
      <Container>
        <SectionHeader
          eyebrow="Témoignages"
          title="La confiance de milliers de parents"
          description="Des avis authentiques de familles qui nous font confiance au quotidien."
          align="center"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <FadeIn key={item.author} delay={index * 0.08}>
              <blockquote className="flex h-full flex-col border border-line bg-white p-8 md:p-10">
                <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-muted-light">
                  Note · 5/5
                </p>
                <p className="flex-1 font-display text-xl font-light italic leading-[1.6] text-charcoal">
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
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

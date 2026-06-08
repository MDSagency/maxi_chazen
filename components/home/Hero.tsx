"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={ref}
      className="paper-grain relative overflow-hidden bg-surface section-editorial pt-36 md:pt-48"
    >
      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="max-w-xl">
          <FadeIn>
            <p className="eyebrow mb-8 text-brand-blue">Soins premium pour bébé</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-balance font-display text-[2.75rem] leading-[1.05] text-ink md:text-5xl lg:text-[4rem]">
              L&apos;essentiel pour une enfance apaisée.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-md text-[15px] font-light leading-[1.85] text-muted md:text-base">
              Des soins doux, sûrs et élégants — formulés pour la peau délicate
              de votre bébé, avec la rigueur d&apos;une maison de luxe.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Button href="/products" size="lg">
                Découvrir la collection
              </Button>
              <Button href="#histoire" variant="ghost" size="md">
                Notre histoire
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-line pt-10">
              <div>
                <p className="font-display text-3xl text-ink">4.9</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-light">
                  Note clients
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-ink">100%</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-light">
                  Testé dermatologiquement
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-ink">48h</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-light">
                  Livraison Algérie
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} direction="none">
          <motion.div style={{ y: imageY }} className="relative mx-auto w-full lg:mx-0">
            <EditorialImage
              src={BRAND_IMAGES.hero}
              alt="Lien tendre entre parent et bébé — Maxi Chazen"
              aspect="hero"
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="luxury-shadow-deep"
            />

            <div className="absolute -bottom-8 left-0 flex max-w-[280px] items-start gap-4 border border-line bg-white p-5 luxury-shadow md:-left-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-paper">
                <Image
                  src={BRAND_IMAGES.products.balm}
                  alt="Baume barrière Maxi Chazen"
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                />
              </div>
              <div>
                <p className="eyebrow mb-2 text-brand-blue">Maxi Chazen</p>
                <p className="text-sm font-light leading-relaxed text-charcoal">
                  Baume barrière doux — formulé pour la peau délicate.
                </p>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </Container>
    </section>
  );
}

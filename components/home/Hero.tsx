"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import BrandMark from "@/components/ui/BrandMark";
import AnchorLink from "@/components/ui/AnchorLink";
import RevealText from "@/components/motion/RevealText";
import LineReveal from "@/components/motion/LineReveal";
import ClipReveal from "@/components/motion/ClipReveal";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import CountStat from "@/components/motion/CountStat";
import { BRAND_IMAGES } from "@/lib/images";
import HeroImage from "@/lib/Hero Image.jpg";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const stats = [
  { value: "4.9", label: "Note clients" },
  { value: "100%", label: "Testé dermatologiquement" },
  { value: "48h", label: "Livraison Algérie" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.82]);

  return (
    <section
      ref={ref}
      className="paper-grain relative overflow-hidden bg-surface pb-16 sm:pb-24 md:pb-32 lg:pb-40 pt-0 sm:pt-4 md:pt-6 lg:pt-8 -mt-40 sm:-mt-40 md:-mt-44 lg:-mt-44"
    >
      <div
        className="pointer-events-none absolute -right-24 top-32 hidden h-72 w-72 rounded-full bg-brand-blue/[0.04] blur-3xl md:block"
        aria-hidden
      />

      <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
        <motion.div
          style={reduced ? undefined : { opacity: contentOpacity }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <FadeIn>
            <p className="eyebrow mb-3 text-brand-blue">
              Soins premium pour bébé
            </p>
            <LineReveal align="left" className="mx-auto lg:mx-0" />
          </FadeIn>

          <RevealText
            text="L'essentiel pour une enfance apaisée."
            as="h1"
            className="mt-4 justify-center text-balance font-display text-[2.35rem] leading-[1.06] text-ink sm:text-[2.75rem] md:text-5xl lg:justify-start lg:text-[4rem]"
          />

          <FadeIn delay={0.25} blur>
            <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-[1.85] text-muted md:text-base lg:mx-0">
              Des soins doux, sûrs et élégants, formulés pour la peau délicate
              de votre bébé, avec la rigueur d&apos;une maison de luxe.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:justify-start">
              <Button href="/products" size="lg" className="w-full sm:w-auto">
                Découvrir la collection
              </Button>
              <AnchorLink
                href="/#histoire"
                className="group/link inline-flex h-12 w-full items-center justify-center gap-3 px-7 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:text-brand-blue sm:w-auto"
              >
                Notre histoire
                <span className="inline-block transition-transform duration-500 group-hover/link:translate-x-1">
                  →
                </span>
              </AnchorLink>
            </div>
          </FadeIn>

          <StaggerGroup
            className="mt-14 grid grid-cols-3 gap-4 border-t border-line pt-10 sm:gap-8"
            stagger={0.08}
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <CountStat
                  value={stat.value}
                  label={stat.label}
                  className="text-center lg:text-left"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <ClipReveal direction="up" delay={0.12} immediate>
            <motion.div
              style={reduced ? undefined : { y: imageY }}
              className="relative"
            >
              <EditorialImage
                src={HeroImage}
                alt="Lien tendre entre parent et bébé — Maxi Chazen"
                aspect="landscape"
                priority
                parallax
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="luxury-shadow-deep"
              />
            </motion.div>
          </ClipReveal>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import RevealText from "@/components/motion/RevealText";
import LineReveal from "@/components/motion/LineReveal";
import ClipReveal from "@/components/motion/ClipReveal";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { BRAND_IMAGES } from "@/lib/images";
import imgBaby1 from "@/lib/Baby 1 .jpg";
import imgBaby2 from "@/lib/baby 2.jpg";
import imgBaby3 from "@/lib/baby 3.jpg";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const values = [
  {
    num: "01",
    title: "Fabriqué en Algérie",
    text: "Conçu et produit localement, Maxi Chazen porte une exigence de savoir-faire algérien — au service des familles d'aujourd'hui.",
  },
  {
    num: "02",
    title: "Qualité contrôlée",
    text: "Chaque formule est soumise à des contrôles rigoureux, de la sélection des ingrédients jusqu'à la mise en pot.",
  },
  {
    num: "03",
    title: "Formules sûres",
    text: "Testées dermatologiquement, nos soins respectent la barrière cutanée fragile des tout-petits, dès la naissance.",
  },
];

const tags = ["Qualité contrôlée", "Formules sûres", "Made in Algeria"];

export default function NotreHistoire() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="histoire"
      className="anchor-section border-t border-line bg-paper paper-grain section-editorial"
      aria-labelledby="notre-histoire-title"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="text-center lg:col-span-5 lg:text-left">
            <FadeIn>
              <p className="eyebrow mb-5">Notre histoire</p>
              <LineReveal align="left" className="mx-auto lg:mx-0" />
            </FadeIn>

            <RevealText
              id="notre-histoire-title"
              text="Soins essentiels pour les tout-petits."
              as="h2"
              className="mt-6 justify-center font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:justify-start lg:text-[3.25rem]"
            />

            <FadeIn delay={0.12}>
              <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-brand-blue">
                Fabriqué en Algérie
              </p>
              <p className="mx-auto mt-3 max-w-md font-light leading-[1.9] text-muted md:text-base lg:mx-0">
                Soins essentiels pour les tout-petits, Qualité contrôlée,
                Formules sûres et testées dermatologiquement
              </p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-[1.9] text-charcoal md:text-base lg:mx-0">
                Née d&apos;une conviction simple, que chaque bébé mérite des
                soins à la hauteur de sa fragilité, Maxi Chazen allie rigueur
                scientifique et attention maternelle. Nous formulons l&apos;essentiel,
                rien de superflu : des produits sûrs, doux, et pensés pour
                accompagner les premiers gestes du quotidien.
              </p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <p className="mx-auto mt-6 max-w-md text-[15px] font-light leading-[1.9] text-muted lg:mx-0">
                Notre maison croit en une cosmétique infantile exigeante,
                accessible et profondément humaine. Chaque création reflète notre
                engagement envers la sécurité, la transparence et le respect de la
                peau délicate des tout-petits.
              </p>
            </FadeIn>

            <StaggerGroup
              className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start"
              stagger={0.07}
            >
              {tags.map((tag, index) => (
                <StaggerItem key={tag}>
                  <motion.span
                    whileHover={
                      reduced
                        ? undefined
                        : { y: -2, borderColor: "rgba(0, 140, 202, 0.35)" }
                    }
                    className={
                      index === 2
                        ? "border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink"
                        : "border border-line bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink"
                    }
                  >
                    {tag}
                  </motion.span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <div className="lg:col-span-7">
            <ClipReveal direction="left" delay={0.1}>
              <EditorialImage
                src={imgBaby2}
                alt="Moment de tendresse entre mère et bébé — Maxi Chazen"
                aspect="landscape"
                parallax
                hoverZoom
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="luxury-shadow-deep"
              />
            </ClipReveal>

            <StaggerGroup
              className="mt-4 grid gap-4 sm:grid-cols-2"
              stagger={0.1}
              delay={0.15}
            >
              <StaggerItem>
                <ClipReveal direction="up" delay={0.05}>
                  <EditorialImage
                    src={imgBaby1}
                    alt="Routine de soin quotidienne — essentiels Maxi Chazen"
                    aspect="portrait"
                    hoverZoom
                    sizes="(max-width: 640px) 100vw, 29vw"
                  />
                </ClipReveal>
              </StaggerItem>
              <StaggerItem>
                <ClipReveal direction="up" delay={0.12}>
                  <EditorialImage
                    src={imgBaby3}
                    alt="Moment de douceur et de sérénité — Maxi Chazen"
                    aspect="portrait"
                    hoverZoom
                    sizes="(max-width: 640px) 100vw, 29vw"
                  />
                </ClipReveal>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>

        <StaggerGroup
          className="mt-16 grid gap-px border-t border-line bg-line md:mt-20 md:grid-cols-3"
          stagger={0.09}
        >
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <motion.div
                whileHover={
                  reduced ? undefined : { backgroundColor: "rgba(255,255,255,0.65)" }
                }
                className="group/value bg-paper px-6 py-10 text-center transition-colors duration-700 md:px-10 md:py-12 md:text-left"
              >
                <span className="font-display text-2xl text-muted-light transition-colors duration-500 group-hover/value:text-brand-blue">
                  {value.num}
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">{value.title}</h3>
                <p className="mx-auto mt-4 max-w-sm text-[14px] font-light leading-[1.85] text-muted md:mx-0">
                  {value.text}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}

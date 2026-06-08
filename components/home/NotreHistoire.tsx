"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

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

export default function NotreHistoire() {
  return (
    <section
      id="histoire"
      className="anchor-section border-t border-line bg-paper paper-grain section-editorial"
      aria-labelledby="notre-histoire-title"
    >
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="eyebrow mb-6">Notre histoire</p>
              <h2
                id="notre-histoire-title"
                className="font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:text-[3.25rem]"
              >
                Soins essentiels pour les tout-petits.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-brand-blue">
                Fabriqué en Algérie
              </p>
              <p
                className="mt-3 font-light leading-[1.9] text-muted md:text-base"
                dir="rtl"
                lang="ar"
              >
                عناية أساسية للرضع · جودة مراقبة · تركيبات آمنة
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-md text-[15px] font-light leading-[1.9] text-charcoal md:text-base">
                Née d&apos;une conviction simple — que chaque bébé mérite des
                soins à la hauteur de sa fragilité — Maxi Chazen allie rigueur
                scientifique et attention maternelle. Nous formulons l&apos;essentiel,
                rien de superflu : des produits sûrs, doux, et pensés pour
                accompagner les premiers gestes du quotidien.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-md text-[15px] font-light leading-[1.9] text-muted">
                Notre maison croit en une cosmétique infantile exigeante,
                accessible et profondément humaine. Chaque création reflète notre
                engagement envers la sécurité, la transparence et le respect de la
                peau délicate des tout-petits.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="mt-12 flex flex-wrap gap-3">
                <span className="border border-line bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink">
                  Qualité contrôlée
                </span>
                <span className="border border-line bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink">
                  Formules sûres
                </span>
                <span className="border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink">
                  Made in Algeria
                </span>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.1}>
              <EditorialImage
                src={BRAND_IMAGES.editorial.confianceParentale}
                alt="Moment de soin entre parent et bébé — Maxi Chazen"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="luxury-shadow-deep"
              />
            </FadeIn>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FadeIn delay={0.18}>
                <EditorialImage
                  src={BRAND_IMAGES.story}
                  alt="Routine de soin quotidienne — essentiels Maxi Chazen"
                  aspect="portrait"
                  sizes="(max-width: 640px) 100vw, 29vw"
                />
              </FadeIn>
              <FadeIn delay={0.22}>
                <EditorialImage
                  src={BRAND_IMAGES.products.nursery}
                  alt="Ligne de soins premium Maxi Chazen"
                  aspect="portrait"
                  sizes="(max-width: 640px) 100vw, 29vw"
                />
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-px border-t border-line bg-line md:grid-cols-3">
          {values.map((value, index) => (
            <FadeIn key={value.title} delay={0.08 * index}>
              <div className="bg-paper px-8 py-10 md:px-10 md:py-12">
                <span className="font-display text-2xl text-muted-light">
                  {value.num}
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {value.title}
                </h3>
                <p className="mt-4 text-[14px] font-light leading-[1.85] text-muted">
                  {value.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

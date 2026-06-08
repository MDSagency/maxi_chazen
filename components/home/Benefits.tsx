"use client";

import FadeIn from "@/components/motion/FadeIn";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

const benefits = [
  {
    num: "01",
    title: "Soins Délicats",
    text: "Des textures légères et des gestes de soin pensés pour la peau la plus fragile, dès les premiers jours.",
    image: BRAND_IMAGES.editorial.soinsDelicats,
    alt: "Rituel de soin délicat — bien-être quotidien de bébé",
  },
  {
    num: "02",
    title: "Produits Naturels",
    text: "Des actifs d'origine naturelle, sélectionnés pour leur pureté et leur douceur sur la peau de bébé.",
    image: BRAND_IMAGES.editorial.produitsNaturels,
    alt: "Essentiels de soin naturels — routine Maxi Chazen",
  },
  {
    num: "03",
    title: "Protection Quotidienne",
    text: "Des formules qui protègent, hydratent et apaisent — pour un quotidien serein, en toute confiance.",
    image: BRAND_IMAGES.editorial.protectionQuotidienne,
    alt: "Pureté et protection — douceur au quotidien",
  },
  {
    num: "04",
    title: "Confiance Parentale",
    text: "Testés dermatologiquement et formulés avec exigence, nos soins accompagnent chaque étape avec sérénité.",
    image: BRAND_IMAGES.editorial.confianceParentale,
    alt: "Lien de confiance entre parent et bébé",
  },
];

export default function Benefits() {
  return (
    <section
      id="engagements"
      className="paper-grain border-y border-line bg-paper section-editorial"
    >
      <Container>
        <SectionHeader
          eyebrow="Nos engagements"
          title="La promesse Maxi Chazen"
          description="Quatre piliers qui guident chacune de nos formules — pour votre tranquillité d'esprit."
          align="center"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {benefits.map((benefit, index) => (
            <FadeIn key={benefit.title} delay={index * 0.06}>
              <article className="group flex h-full flex-col border border-line bg-white transition-colors duration-700 hover:bg-paper">
                <EditorialImage
                  src={benefit.image}
                  alt={benefit.alt}
                  aspect="landscape"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="luxury-shadow"
                />
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <span className="mb-5 font-display text-2xl text-muted-light">
                    {benefit.num}
                  </span>
                  <h3 className="mb-4 font-display text-2xl text-ink">
                    {benefit.title}
                  </h3>
                  <p className="text-[14px] font-light leading-[1.8] text-muted">
                    {benefit.text}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

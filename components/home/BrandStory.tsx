"use client";

import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

const pillars = [
  {
    num: "01",
    title: "La qualité avant tout",
    text: "Ingrédients soigneusement sélectionnés, sourcés avec respect pour la peau fragile de bébé.",
  },
  {
    num: "02",
    title: "Sécurité certifiée",
    text: "Formules testées dermatologiquement, sans irritants pour les peaux les plus sensibles.",
  },
  {
    num: "03",
    title: "Exigence artisanale",
    text: "Chaque produit est conçu par des experts passionnés par le bien-être des familles.",
  },
];

export default function BrandStory() {
  return (
    <section id="histoire" className="border-t border-line bg-surface section-editorial">
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-28">
          <FadeIn>
            <div className="space-y-4">
              <EditorialImage
                src={BRAND_IMAGES.story}
                alt="Routine de soin Maxi Chazen — bébé et essentiels"
                aspect="portrait"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="luxury-shadow"
              />
              <EditorialImage
                src={BRAND_IMAGES.products.nursery}
                alt="Ligne lotion et crème Maxi Chazen"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </FadeIn>

          <div>
            <SectionHeader
              eyebrow="Notre histoire"
              title="La confiance des parents, notre plus belle récompense."
              description="Chez Maxi Chazen, nous croyons que chaque geste de soin doit être un moment de sérénité — pour bébé, et pour vous."
            />

            <FadeIn delay={0.15}>
              <blockquote className="mb-14 border-l border-ink pl-8 font-display text-2xl font-light italic leading-[1.5] text-charcoal md:text-[1.65rem]">
                « L&apos;enfance doit être remplie de simplicité et de qualité.
                Nos soins accompagnent chaque étape avec douceur. »
              </blockquote>
            </FadeIn>

            <div className="space-y-10">
              {pillars.map((pillar, index) => (
                <FadeIn key={pillar.title} delay={0.1 * index}>
                  <div className="group grid grid-cols-[3rem_1fr] gap-6 border-t border-line pt-8">
                    <span className="font-display text-2xl text-muted-light">
                      {pillar.num}
                    </span>
                    <div>
                      <h3 className="mb-3 font-display text-xl text-ink">
                        {pillar.title}
                      </h3>
                      <p className="text-[15px] font-light leading-[1.8] text-muted">
                        {pillar.text}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

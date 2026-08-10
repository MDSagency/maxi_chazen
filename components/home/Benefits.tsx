"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import EditorialImage from "@/components/ui/EditorialImage";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import { BRAND_IMAGES } from "@/lib/images";
import naturelProducts from "@/lib/naturel products.jpg";
import soinsDelicatsImg from "@/lib/soins delicats.jpg";
import image4 from "@/lib/image  4.jpg";
import image2 from "@/lib/image 2.jpg";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const benefits = [
  {
    num: "01",
    title: "Soins Délicats",
    text: "Des textures légères et des gestes de soin pensés pour la peau la plus fragile, dès les premiers jours.",
    image: soinsDelicatsImg.src ?? soinsDelicatsImg,
    alt: "Rituel de soin délicat — bien-être quotidien de bébé",
  },
  {
    num: "02",
    title: "Produits Naturels",
    text: "Des actifs d'origine naturelle, sélectionnés pour leur pureté et leur douceur sur la peau de bébé.",
    image: naturelProducts.src ?? naturelProducts,
    alt: "Essentiels de soin naturels — routine Maxi Chazen",
  },
  {
    num: "03",
    title: "Protection Quotidienne",
    text: "Des formules qui protègent, hydratent et apaisent — pour un quotidien serein, en toute confiance.",
    image: image4.src ?? image4,
    alt: "Pureté et protection — douceur au quotidien",
  },
  {
    num: "04",
    title: "Confiance Parentale",
    text: "Testés dermatologiquement et formulés avec exigence, nos soins accompagnent chaque étape avec sérénité.",
    image: image2.src ?? image2,
    alt: "Lien de confiance entre parent et bébé",
  },
];

export default function Benefits() {
  const reduced = usePrefersReducedMotion();

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

        <StaggerGroup className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10" stagger={0.1}>
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <motion.article
                whileHover={
                  reduced
                    ? undefined
                    : { y: -4, boxShadow: "0 40px 80px -24px rgba(17, 17, 17, 0.08)" }
                }
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full flex-col overflow-hidden border border-line bg-white"
              >
                <EditorialImage
                  src={benefit.image}
                  alt={benefit.alt}
                  aspect="landscape"
                  hoverZoom
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="luxury-shadow"
                />
                <div className="flex flex-1 flex-col p-6 text-center md:p-10 md:text-left">
                  <span className="mb-5 font-display text-2xl text-muted-light transition-colors duration-500 group-hover:text-brand-blue">
                    {benefit.num}
                  </span>
                  <h3 className="mb-4 font-display text-2xl text-ink">{benefit.title}</h3>
                  <p className="mx-auto max-w-sm text-[14px] font-light leading-[1.8] text-muted md:mx-0">
                    {benefit.text}
                  </p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}

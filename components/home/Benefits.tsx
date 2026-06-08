"use client";

import FadeIn from "@/components/motion/FadeIn";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

const benefits = [
  {
    num: "01",
    title: "Ingrédients sûrs",
    text: "Formules sans substances controversées, adaptées aux peaux les plus sensibles.",
  },
  {
    num: "02",
    title: "Testé dermatologiquement",
    text: "Chaque produit est validé par des experts pour garantir tolérance et efficacité.",
  },
  {
    num: "03",
    title: "Formules naturelles",
    text: "Des actifs d'origine naturelle, sélectionnés pour leur douceur et leur pureté.",
  },
  {
    num: "04",
    title: "Adapté aux bébés",
    text: "Conçu spécifiquement pour les premiers gestes de soin, dès la naissance.",
  },
];

export default function Benefits() {
  return (
    <section className="paper-grain border-y border-line bg-paper section-editorial">
      <Container>
        <SectionHeader
          eyebrow="Nos engagements"
          title="La promesse Maxi Chazen"
          description="Quatre piliers qui guident chacune de nos formules — pour votre tranquillité d'esprit."
          align="center"
        />

        <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FadeIn key={benefit.title} delay={index * 0.06}>
              <div className="group flex h-full flex-col bg-paper p-8 md:p-10 transition-colors duration-700 hover:bg-white">
                <span className="mb-8 font-display text-3xl text-muted-light">
                  {benefit.num}
                </span>
                <h3 className="mb-4 font-display text-xl text-ink">
                  {benefit.title}
                </h3>
                <p className="text-[14px] font-light leading-[1.8] text-muted">
                  {benefit.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

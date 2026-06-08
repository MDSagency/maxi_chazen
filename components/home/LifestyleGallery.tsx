"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import EditorialImage from "@/components/ui/EditorialImage";
import { BRAND_IMAGES } from "@/lib/images";

const gallery = [
  {
    src: BRAND_IMAGES.lifestyle.productFlatlay,
    alt: "Collection Maxi Chazen — essentiels de soin bébé",
    caption: "La collection",
  },
  {
    src: BRAND_IMAGES.lifestyle.nursery,
    alt: "Rituel de soin délicat pour bébé",
    caption: "Le rituel",
  },
  {
    src: BRAND_IMAGES.lifestyle.texture,
    alt: "Pureté et douceur — moment de sérénité",
    caption: "La pureté",
  },
];

export default function LifestyleGallery() {
  return (
    <section className="border-t border-line bg-paper py-20 md:py-28">
      <Container>
        <FadeIn className="mb-12 text-center md:mb-16">
          <p className="eyebrow mb-4">Univers visuel</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            L&apos;art du soin, au quotidien
          </h2>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {gallery.map((item, index) => (
            <FadeIn key={item.caption} delay={index * 0.08}>
              <figure>
                <EditorialImage
                  src={item.src}
                  alt={item.alt}
                  aspect="portrait"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.24em] text-muted-light">
                  {item.caption}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

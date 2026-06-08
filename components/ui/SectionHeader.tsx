"use client";

import { cn } from "@/lib/cn";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import LineReveal from "@/components/motion/LineReveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleId,
}: SectionHeaderProps) {
  const centered = align === "center";
  const mobileCentered = className?.includes("text-center");

  return (
    <FadeIn
      className={cn(
        "mb-14 md:mb-20",
        centered && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow mb-5",
            (centered || mobileCentered) && "mx-auto md:mx-0",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <LineReveal
        align={centered ? "center" : "left"}
        className={mobileCentered ? "mx-auto md:mx-0" : undefined}
      />
      <RevealText
        text={title}
        as="h2"
        id={titleId}
        className={cn(
          "text-balance font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:text-[3.25rem]",
          centered && "justify-center",
          mobileCentered && "justify-center md:justify-start",
        )}
      />
      {description ? (
        <p
          className={cn(
            "mt-6 max-w-lg text-[15px] font-light leading-[1.8] text-muted md:text-base",
            (centered || mobileCentered) && "mx-auto md:mx-0",
          )}
        >
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}

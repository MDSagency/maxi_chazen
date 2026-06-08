import { cn } from "@/lib/cn";
import FadeIn from "@/components/motion/FadeIn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn
      className={cn(
        "mb-14 md:mb-20",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      <h2 className="text-balance font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:text-[3.25rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-lg text-[15px] font-light leading-[1.8] text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}

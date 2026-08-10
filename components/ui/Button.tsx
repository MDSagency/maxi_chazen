"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** @deprecated kept for API compat — no scale animation */
  magnetic?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-yellow text-ink hover:bg-[#f0c800] border border-brand-yellow",
  secondary:
    "bg-ink text-white hover:bg-charcoal border border-ink",
  ghost:
    "bg-transparent text-ink hover:text-charcoal border border-transparent",
  outline:
    "border border-brand-yellow bg-transparent text-ink hover:border-brand-yellow/90 hover:bg-paper/60",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[10px] tracking-[0.18em] uppercase",
  md: "h-11 px-7 text-[10px] tracking-[0.2em] uppercase",
  lg: "h-12 px-10 text-[10px] tracking-[0.22em] uppercase",
};

function ButtonInner({
  children,
  className,
  variant = "primary",
  size = "md",
}: ButtonBaseProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.span
      className={cn(
        "group/btn relative inline-flex items-center justify-center overflow-hidden font-sans font-normal transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:cursor-not-allowed disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      whileHover={reduced ? undefined : { y: -1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
        aria-hidden
      />
      <span className="relative z-[1]">{children}</span>
    </motion.span>
  );
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className="inline-flex" {...linkProps}>
        <ButtonInner variant={variant} size={size} className={className}>
          {children}
        </ButtonInner>
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      className="inline-flex disabled:cursor-not-allowed"
      disabled={disabled}
      {...buttonProps}
    >
      <ButtonInner variant={variant} size={size} className={className}>
        {children}
      </ButtonInner>
    </button>
  );
}

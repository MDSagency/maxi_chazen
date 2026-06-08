"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

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
    "border border-ink/20 bg-transparent text-ink hover:border-ink/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[10px] tracking-[0.18em] uppercase",
  md: "h-11 px-7 text-[10px] tracking-[0.2em] uppercase",
  lg: "h-12 px-10 text-[10px] tracking-[0.22em] uppercase",
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-sans font-normal transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:cursor-not-allowed disabled:opacity-40",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

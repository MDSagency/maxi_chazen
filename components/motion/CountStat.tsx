"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CountStatProps = {
  value: string;
  label: string;
  className?: string;
};

function parseNumeric(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { number: Number(match[1]), suffix: match[2] };
}

export default function CountStat({ value, label, className }: CountStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const parsed = parseNumeric(value);

  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => {
    if (!parsed) return value;
    const formatted =
      parsed.number % 1 !== 0 ? v.toFixed(1) : Math.round(v).toString();
    return `${formatted}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!parsed || reduced) return;
    if (inView) spring.set(parsed.number);
  }, [inView, parsed, reduced, spring]);

  return (
    <div ref={ref} className={className}>
      {parsed && !reduced ? (
        <motion.p className="font-display text-3xl text-ink">{display}</motion.p>
      ) : (
        <p className="font-display text-3xl text-ink">{value}</p>
      )}
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-light">
        {label}
      </p>
    </div>
  );
}

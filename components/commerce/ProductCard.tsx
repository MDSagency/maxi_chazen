"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { resolveProductImage } from "@/lib/images";
import Button from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ProductCardProps = {
  product: Product;
  onAddToCart?: (id: string) => void;
  index?: number;
};

export default function ProductCard({
  product,
  onAddToCart,
  index = 0,
}: ProductCardProps) {
  const imageSrc = resolveProductImage(product);
  const reduced = usePrefersReducedMotion();

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.95,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduced ? undefined : { y: -4 }}
      className="group flex flex-col"
    >
      <Link
        href={`/products/${product.id}`}
        className="relative mb-5 block aspect-[4/5] overflow-hidden bg-paper"
      >
        <motion.div
          className="absolute inset-0"
          whileHover={reduced ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center brightness-[1.03] contrast-[0.96] saturate-[0.88] transition-[filter] duration-700 group-hover:brightness-[1.06]"
          />
        </motion.div>

        {!product.in_stock ? (
          <span className="absolute left-0 top-0 z-[1] bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-muted">
            Rupture
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 text-center md:text-left">
        <div>
          <p className="eyebrow mb-2">{product.category}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-display text-lg leading-snug text-ink transition-colors duration-500 hover:text-brand-blue md:text-xl">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 border-t border-brand-yellow pt-4 sm:flex-row sm:items-end sm:justify-between md:items-end">
          <p className="text-sm font-normal tracking-wide text-ink">
            {product.price.toLocaleString("fr-FR")} DA
          </p>
          {onAddToCart ? (
            <Button
              size="sm"
              variant="outline"
              disabled={!product.in_stock}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product.id);
              }}
              className="w-full sm:w-auto"
            >
              Ajouter
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

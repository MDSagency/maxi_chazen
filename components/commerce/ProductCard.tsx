"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import Button from "@/components/ui/Button";

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 1,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group flex flex-col"
    >
      <Link
        href={`/products/${product.id}`}
        className="relative mb-5 block aspect-[4/5] overflow-hidden bg-paper"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-opacity duration-700 group-hover:opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-paper" />
        )}

        {!product.in_stock ? (
          <span className="absolute left-0 top-0 bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-muted">
            Rupture
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <p className="eyebrow mb-2">{product.category}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-display text-lg leading-snug text-ink transition-colors duration-500 hover:text-charcoal md:text-xl">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4">
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
            >
              Ajouter
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/commerce/ProductCard";
import CartToast from "@/components/commerce/CartToast";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, successMessage } = useCart();

  useEffect(() => {
    async function load() {
      const data = await fetchProducts({ featured: true, limit: 4 });
      if (data.length === 0) {
        const fallback = await fetchProducts({ limit: 4 });
        setProducts(fallback);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }
    void load();
  }, []);

  return (
    <section id="produits" className="border-t border-line bg-surface section-editorial">
      <Container>
        <div className="mb-14 flex flex-col items-center gap-8 text-center md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10 md:text-left">
          <SectionHeader
            eyebrow="Collection"
            title="Nos produits phares"
            description="Une sélection raffinée de soins essentiels pour le quotidien de bébé."
            className="mb-0 w-full text-center md:text-left"
            align="left"
          />
          <Button href="/products" variant="outline" className="w-full sm:w-auto">
            Voir toute la collection
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse bg-line"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <StaggerGroup
            className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-10"
            stagger={0.08}
          >
            {products.map((product, index) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  product={product}
                  index={index}
                  onAddToCart={addToCart}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <p className="text-center text-muted">
            Aucun produit disponible pour le moment.
          </p>
        )}
      </Container>
      <CartToast message={successMessage} />
    </section>
  );
}

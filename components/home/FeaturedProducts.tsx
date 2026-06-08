"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mapProduct, type Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/commerce/ProductCard";
import CartToast from "@/components/commerce/CartToast";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, successMessage } = useCart();

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, category, name, price, in_stock, image, created_at")
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setProducts(
          data
            .map((item) => mapProduct(item as Record<string, unknown>))
            .filter((p): p is Product => p !== null),
        );
      }
      setLoading(false);
    }
    void load();
  }, []);

  return (
    <section id="produits" className="border-t border-line bg-surface section-editorial">
      <Container>
        <div className="mb-14 flex flex-col items-start justify-between gap-10 md:mb-20 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Collection"
            title="Nos produits phares"
            description="Une sélection raffinée de soins essentiels pour le quotidien de bébé."
            className="mb-0"
          />
          <Button href="/products" variant="outline">
            Voir toute la collection
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-line" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={addToCart}
              />
            ))}
          </div>
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

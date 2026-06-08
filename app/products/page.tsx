"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mapProduct, type Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/commerce/ProductCard";
import CartToast from "@/components/commerce/CartToast";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, successMessage } = useCart();

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setLoadingProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, category, name, price, in_stock, image, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProductsList(
          data
            .map((item) => mapProduct(item as Record<string, unknown>))
            .filter((p): p is Product => p !== null),
        );
      }
      setLoadingProducts(false);
    }

    void loadProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        productsList
          .map((p) => p.category.trim())
          .filter((c) => c.length > 0),
      ),
    );
    return ["Tout", ...unique.sort((a, b) => a.localeCompare(b, "fr"))];
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Tout") return productsList;
    return productsList.filter((p) => p.category.trim() === activeCategory);
  }, [activeCategory, productsList]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <section className="bg-surface pb-32 pt-32 md:pt-44">
      <Container>
        <div className="mb-14 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Collection"
            title="Nos produits"
            description="Des soins pensés pour la douceur du quotidien — une sélection éditoriale, claire et raffinée."
            className="mb-0"
          />
          <div className="border border-line bg-paper px-8 py-6 text-center md:text-left">
            <p className="eyebrow mb-2">Catalogue</p>
            <p className="font-display text-4xl text-ink">
              {filteredProducts.length.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-light">
              références
            </p>
          </div>
        </div>

        <div
          className="mb-14 flex flex-wrap gap-0 border-y border-line"
          aria-label="Filtres de produits"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "border-r border-line px-6 py-4 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 last:border-r-0",
                activeCategory === category
                  ? "bg-ink text-white"
                  : "bg-transparent text-muted hover:bg-paper hover:text-ink",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-line" />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <p className="py-24 text-center font-light text-muted">
            Aucun produit disponible.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-10">
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-20 flex items-center justify-center gap-8 border-t border-line pt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
              {safePage.toString().padStart(2, "0")} /{" "}
              {totalPages.toString().padStart(2, "0")}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Suivant
            </Button>
          </div>
        ) : null}
      </Container>
      <CartToast message={successMessage} />
    </section>
  );
}

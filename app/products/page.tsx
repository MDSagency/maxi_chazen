"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
  in_stock: boolean;
  image: string;
  created_at?: string;
};

type CartItem = { id: string; quantity: number };

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [currentPage, setCurrentPage] = useState(1);

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

      if (error || !data || !Array.isArray(data)) {
        setLoadingProducts(false);
        return;
      }

      const mapped = data.map((item) => ({
        id: String(item.id || "").trim(),
        category: String(item.category || ""),
        name: String(item.name || ""),
        price: Number(item.price) || 0,
        in_stock:
          item.in_stock === true ||
          item.in_stock === "true" ||
          item.in_stock === 1,
        image: String(item.image || ""),
        created_at: item.created_at ? String(item.created_at) : undefined,
      })) as Product[];

      setProductsList(mapped.filter((item) => item.id.length > 0));
      setLoadingProducts(false);
    }

    void loadProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("maxi-cart");
    if (!stored) return;
    try {
      setCart(JSON.parse(stored));
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("maxi-cart", JSON.stringify(cart));
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    window.dispatchEvent(
      new CustomEvent("maxi-cart-updated", { detail: { totalQuantity } }),
    );
  }, [cart]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        productsList
          .map((product) => product.category.trim())
          .filter((category) => category.length > 0),
      ),
    );

    return [
      "Tout",
      ...uniqueCategories.sort((left, right) =>
        left.localeCompare(right, "fr"),
      ),
    ];
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Tout") {
      return productsList;
    }

    return productsList.filter(
      (product) => product.category.trim() === activeCategory,
    );
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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const addToCart = (productId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId);
      const nextCart = existing
        ? current.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { id: productId, quantity: 1 }];

      const total = nextCart.reduce((sum, item) => sum + item.quantity, 0);
      window.dispatchEvent(
        new CustomEvent("maxi-cart-updated", {
          detail: { totalQuantity: total },
        }),
      );

      setSuccessMessage("Produit ajouté avec succès !");
      window.setTimeout(() => setSuccessMessage(""), 1800);
      return nextCart;
    });
  };

  return (
    <section className="products-page" id="produits">
      <div className="products-page__shell">
        <div className="products-page__intro">
          <div className="products-page__intro-copy">
            <p className="products-page__eyebrow">Collection Maxi Chazen</p>
            <h1 className="products-page__title">Nos produits</h1>
            <p className="products-page__lead">
              Des soins pensés pour la douceur du quotidien, avec une sélection
              simple, claire et élégante.
            </p>
          </div>

          <div className="products-page__stat-card">
            <span className="products-page__stat-label">Catalogue complet</span>
            <strong className="products-page__stat-value">
              {filteredProducts.length.toString().padStart(2, "0")}
            </strong>
            <span className="products-page__stat-caption">
              références sélectionnées
            </span>
          </div>
        </div>

        <div
          className="products-page__filters"
          aria-label="Filtres de produits"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`products-page__filter${
                activeCategory === category
                  ? " products-page__filter--active"
                  : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-page__body">
          <div className="products-page__grid-wrap">
            {loadingProducts ? (
              <p className="products-page__status">
                Chargement des produits...
              </p>
            ) : paginatedProducts.length === 0 ? (
              <p className="products-page__status">Aucun produit disponible.</p>
            ) : (
              <div className="products-page__grid">
                {paginatedProducts.map((product, index) => (
                  <article className="products-page__card" key={product.id}>
                    <div className="products-page__image-wrap">
                      {product.image ? (
                        <img
                          className="products-page__image"
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="products-page__image-placeholder" />
                      )}
                      {!product.in_stock && (
                        <span className="products-page__badge">Rupture</span>
                      )}
                    </div>

                    <div className="products-page__meta">
                      <div>
                        <p className="products-page__category">
                          {product.category}
                        </p>
                        <h2 className="products-page__name">{product.name}</h2>
                      </div>

                      <div className="products-page__purchase">
                        <p className="products-page__price">
                          {product.price.toLocaleString("fr-FR")} DA
                        </p>
                        <button
                          className="products-page__button"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.in_stock}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="products-page__pagination">
              <button
                type="button"
                className="products-page__page-button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
              >
                Précédent
              </button>

              <div className="products-page__page-indicator">
                <span>
                  {safePage.toString().padStart(2, "0")} /{" "}
                  {totalPages.toString().padStart(2, "0")}
                </span>
                <span>Pages</span>
              </div>

              <button
                type="button"
                className="products-page__page-button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safePage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>

          <aside className="products-page__editorial">
            <p className="products-page__editorial-label">Éditorial</p>
            <p className="products-page__editorial-text">
              Chaque produit est sélectionné pour accompagner les premiers
              gestes de soin avec simplicité, douceur et cohérence.
            </p>

            <div className="products-page__editorial-note">
              <span>Navigation rapide</span>
              <Link href="/" className="products-page__editorial-link">
                Retour à l'accueil
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {successMessage && (
        <p className="products-page__toast" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}
    </section>
  );
}

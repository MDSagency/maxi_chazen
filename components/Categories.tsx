"use client";

import { useEffect, useState } from "react";
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

export default function Categories() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setLoadingProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, category, name, price, in_stock, image, created_at")
        .order("created_at", { ascending: false })
        .limit(4); // ← only 4 latest

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
    loadProducts();
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
    <section className="collection" id="produits">
      {/* ── Header ── */}
      <div className="collection__header">
        <div className="collection__header-left">
          <h2 className="collection__title">Nos Produits</h2>
          <p className="collection__subtitle">Dernières Pièces</p>
        </div>
        <a className="collection__view-all" href="/products">
          Voir tout
        </a>
      </div>

      {/* ── Grid ── */}
      {loadingProducts ? (
        <p className="collection__status">Chargement des produits...</p>
      ) : (
        <div className="collection__grid">
          {productsList.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card__image-wrap">
                {product.image ? (
                  <img
                    className="product-card__image"
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="product-card__image-placeholder" />
                )}
                {!product.in_stock && (
                  <span className="product-card__badge">Rupture</span>
                )}
              </div>

              <div className="product-card__footer">
                <div className="product-card__info">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__category">{product.category}</p>
                </div>
                <div className="product-card__right">
                  <p className="product-card__price">
                    {product.price.toLocaleString("fr-FR")} DA
                  </p>
                  <button
                    className="product-card__btn"
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

      {!loadingProducts && productsList.length === 0 && (
        <p className="collection__status">Aucun produit disponible.</p>
      )}

      {successMessage && (
        <p className="collection__toast" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}
    </section>
  );
}

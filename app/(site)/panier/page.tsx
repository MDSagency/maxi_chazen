"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PanierPage() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setProductsList([]);
        setProductsError(
          "Configuration Supabase manquante pour charger les produits.",
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, category, name, price, in_stock, image, created_at")
        .order("created_at", { ascending: false });

      if (error || !Array.isArray(data)) {
        setProductsList([]);
        setProductsError("Impossible de charger les produits.");
        setLoading(false);
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
      setProductsError(null);
      setLoading(false);
    }

    void loadProducts();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("maxi-cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<{
          id: unknown;
          quantity: unknown;
        }>;
        if (Array.isArray(parsed)) {
          setCart(
            parsed
              .map((item) => ({
                id: String(item.id ?? "").trim(),
                quantity: Number(item.quantity) || 0,
              }))
              .filter((item) => item.id.length > 0 && item.quantity > 0),
          );
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("maxi-cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (productId: string) => {
    setCart((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const deleteFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, cartItem) => {
    const product = productsList.find((p) => p.id === cartItem.id);
    return sum + (product?.price || 0) * cartItem.quantity;
  }, 0);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <section className="page-loader-wrap">
        <div className="page-loader" role="status" aria-live="polite">
          <span className="loader-dot" aria-hidden="true"></span>
          <p>Chargement du panier...</p>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="panier-page">
        <div className="cart-empty">
          <h2>Votre panier est vide</h2>
          <p>Commencez vos achats pour ajouter des produits</p>
          <a className="btn-primary btn-large" href="/">
            Retour aux produits
          </a>
        </div>
      </div>
    );
  }

  const missingProductsCount = cart.filter(
    (item) => !productsList.some((product) => product.id === item.id),
  ).length;

  return (
    <div className="panier-page">
      <header className="panier-head">
        <p className="panier-kicker">Mon Panier</p>
        <div className="panier-title-row">
          <h1 className="panier-title">
            Panier ({totalQuantity} article{totalQuantity > 1 ? "s" : ""})
          </h1>
          <a className="panier-return-link" href="/">
            Continuer les achats
          </a>
        </div>
      </header>

      {productsError ? (
        <p className="form-error panier-notice">{productsError}</p>
      ) : null}
      {missingProductsCount > 0 ? (
        <p className="form-error panier-notice">
          Certains produits du panier sont introuvables. Rechargez la page pour
          synchroniser.
        </p>
      ) : null}

      <div className="panier-layout">
        <div className="cart-items">
          {cart.map((cartItem) => {
            const product = productsList.find((p) => p.id === cartItem.id);
            if (!product) return null;

            const subtotal = product.price * cartItem.quantity;

            return (
              <div key={product.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p className="item-category">{product.category}</p>
                  <p className="item-price">
                    {product.price.toLocaleString("fr-FR")} DA / unité
                  </p>
                </div>

                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      −
                    </button>
                    <span className="qty-display">{cartItem.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn-delete"
                    onClick={() => deleteFromCart(product.id)}
                  >
                    Supprimer
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  <span className="subtotal-label">Sous-total</span>
                  <span className="subtotal-value">
                    {subtotal.toLocaleString("fr-FR")} DA
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="cart-summary panier-summary-sticky">
          <div className="summary-row">
            <span>Nombre d'articles</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{cartTotal.toLocaleString("fr-FR")} DA</span>
          </div>

          <button className="btn-confirm" onClick={handleConfirmOrder}>
            Confirmer la commande
          </button>
          <a className="btn-continue" href="/">
            Continuer les achats
          </a>
        </aside>
      </div>

      <div className="panier-mobile-actions">
        <button className="btn-confirm" onClick={handleConfirmOrder}>
          Confirmer la commande
        </button>
        <a className="btn-continue" href="/">
          Continuer les achats
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { defaultShippingTable } from "@/lib/shippingRates";

type CartItem = { id: string; quantity: number };

export default function CheckoutPage() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalOrderSummary, setFinalOrderSummary] = useState<{
    subtotal: number;
    shipping: number;
    total: number;
  } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carrier, setCarrier] = useState("Guepex");
  const [deliveryMethod, setDeliveryMethod] = useState("Retrait en magasin");
  const [wilaya, setWilaya] = useState("Alger");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProductsList(data);
      setLoading(false);
    }
    void loadProducts();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("maxi-cart");
    if (!stored) return;
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
      }
    } catch {
      setCart([]);
    }
  }, []);

  const cartTotal = cart.reduce((sum, cartItem) => {
    const product = productsList.find((p) => p.id === cartItem.id);
    return sum + (product?.price || 0) * cartItem.quantity;
  }, 0);

  const shippingCost =
    deliveryMethod === "Retrait en magasin"
      ? defaultShippingTable[wilaya]?.desk || 0
      : defaultShippingTable[wilaya]?.home || 0;
  const totalPrice = cartTotal + shippingCost;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!fullName.trim() || !phone.trim()) {
      alert("Merci de renseigner le nom et le numéro de téléphone.");
      return;
    }

    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          wilaya,
          deliveryMethod,
          carrier,
          notes,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de la commande.");
      }

      setFinalOrderSummary({
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
      });
      setOrderPlaced(true);
      setCart([]);
      localStorage.removeItem("maxi-cart");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'enregistrement de la commande.";
      setSubmitError(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="page-loader-wrap">
        <div className="page-loader" role="status" aria-live="polite">
          <span className="loader-dot" aria-hidden="true"></span>
          <p>Chargement de la commande...</p>
        </div>
      </section>
    );
  }

  if (orderPlaced) {
    const paidSubtotal = finalOrderSummary?.subtotal ?? cartTotal;
    const paidShipping = finalOrderSummary?.shipping ?? shippingCost;
    const paidTotal = finalOrderSummary?.total ?? totalPrice;

    return (
      <div className="checkout-page">
        <div className="order-success-card">
          <div className="order-success-badge">Commande confirmée</div>
          <h1>Merci {fullName}</h1>
          <p className="order-success-text">
            Votre commande a été enregistrée avec succès.
          </p>

          <div className="order-success-summary">
            <div className="summary-row">
              <span>Sous-total produits</span>
              <strong>{paidSubtotal.toLocaleString("fr-FR")} DA</strong>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <strong>{paidShipping.toLocaleString("fr-FR")} DA</strong>
            </div>
            <div className="summary-row total">
              <span>Total final payé</span>
              <strong>{paidTotal.toLocaleString("fr-FR")} DA</strong>
            </div>
          </div>

          <button className="btn-confirm" onClick={() => router.push("/")}>
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Récapitulatif de la commande</h1>

      <div className="checkout-sides">
        <div className="checkout-card">
          <h2>Informations client</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <label>
              Nom complet *
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
            <label>
              Numéro de téléphone *
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="05XXXXXXXX"
              />
            </label>
            <label>
              Email (facultatif)
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </label>

            <label>
              Transporteur
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              >
                <option>Guepex</option>
              </select>
            </label>

            <label>
              Mode de livraison
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option>Retrait en magasin</option>
                <option>Livraison à domicile</option>
              </select>
            </label>
            <label>
              Wilaya
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
              >
                {Object.keys(defaultShippingTable).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>

            <label>
              Notes de commande
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </label>

            <button type="submit" className="btn-confirm" disabled={submitting}>
              {submitting
                ? "Validation en cours..."
                : `Valider et payer ${totalPrice.toLocaleString("fr-FR")} DA`}
            </button>
          </form>
        </div>
        <div className="checkout-card">
          <h2>Résumé de la commande</h2>
          <div className="summary-row">
            <span>Sous-total</span>
            <strong>{cartTotal.toLocaleString("fr-FR")} DA</strong>
          </div>
          <div className="summary-row">
            <span>Livraison</span>
            <strong>{shippingCost.toLocaleString("fr-FR")} DA</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{totalPrice.toLocaleString("fr-FR")} DA</strong>
          </div>

          <h3>Récapitulatif des produits</h3>
          {cart.map((cartItem) => {
            const product = productsList.find((p) => p.id === cartItem.id);
            if (!product) return null;
            return (
              <div key={product.id} className="product-line">
                <span>
                  {product.name} ×{cartItem.quantity}
                </span>
                <span>
                  {(product.price * cartItem.quantity).toLocaleString("fr-FR")}{" "}
                  DA
                </span>
              </div>
            );
          })}
          {submitError ? <p className="form-error">{submitError}</p> : null}
        </div>
      </div>
    </div>
  );
}

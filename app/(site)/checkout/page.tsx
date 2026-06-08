"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { defaultShippingTable } from "@/lib/shippingRates";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type CartItem = { id: string; quantity: number };

const fieldClassName =
  "w-full border border-line bg-transparent px-4 py-3 text-sm font-light text-ink outline-none transition-colors duration-500 focus:border-ink";
const labelClassName = "block text-[11px] uppercase tracking-[0.18em] text-muted";

function SummaryRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4",
        emphasis ? "border-t border-line" : "border-b border-line",
      )}
    >
      <span
        className={cn(
          "text-sm font-light",
          emphasis
            ? "text-[11px] uppercase tracking-[0.18em] text-ink"
            : "text-muted",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          emphasis ? "font-display text-2xl text-ink" : "text-sm text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function CheckoutPage() {
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
      <div className="flex min-h-[60vh] items-center justify-center pt-36">
        <div className="h-8 w-8 animate-spin border border-line border-t-ink" />
      </div>
    );
  }

  if (orderPlaced) {
    const paidSubtotal = finalOrderSummary?.subtotal ?? cartTotal;
    const paidShipping = finalOrderSummary?.shipping ?? shippingCost;
    const paidTotal = finalOrderSummary?.total ?? totalPrice;

    return (
      <section className="bg-surface pb-32 pt-36 md:pt-48">
        <Container className="max-w-2xl">
          <div className="border border-line bg-paper p-8 md:p-12">
            <p className="eyebrow mb-5 text-brand-blue">Commande confirmée</p>
            <h1 className="font-display text-4xl text-ink md:text-5xl">
              Merci {fullName}
            </h1>
            <p className="mt-6 text-[15px] font-light leading-[1.85] text-muted">
              Votre commande a été enregistrée avec succès. Nous vous
              contacterons très prochainement pour confirmer la livraison.
            </p>

            <div className="mt-10 border-t border-line">
              <SummaryRow
                label="Sous-total produits"
                value={`${paidSubtotal.toLocaleString("fr-FR")} DA`}
              />
              <SummaryRow
                label="Livraison"
                value={`${paidShipping.toLocaleString("fr-FR")} DA`}
              />
              <SummaryRow
                label="Total final"
                value={`${paidTotal.toLocaleString("fr-FR")} DA`}
                emphasis
              />
            </div>

            <Button href="/products" size="lg" className="mt-10 w-full sm:w-auto">
              Continuer les achats
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface pb-32 pt-36 md:pt-48">
      <Container>
        <SectionHeader
          eyebrow="Commande"
          title="Récapitulatif de la commande"
          description="Renseignez vos informations de livraison pour finaliser votre achat."
          className="mb-14 md:mb-20"
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div className="border border-line bg-white p-8">
            <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
              Informations client
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className={cn(labelClassName, "mb-3 block")}>
                  Nom complet *
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={fieldClassName}
                  required
                />
              </label>

              <label className="block">
                <span className={cn(labelClassName, "mb-3 block")}>
                  Numéro de téléphone *
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldClassName}
                  required
                  placeholder="05XXXXXXXX"
                />
              </label>

              <label className="block">
                <span className={cn(labelClassName, "mb-3 block")}>
                  Email (facultatif)
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClassName}
                  placeholder="votre@email.com"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className={cn(labelClassName, "mb-3 block")}>
                    Transporteur
                  </span>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className={fieldClassName}
                  >
                    <option>Guepex</option>
                  </select>
                </label>

                <label className="block">
                  <span className={cn(labelClassName, "mb-3 block")}>
                    Mode de livraison
                  </span>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className={fieldClassName}
                  >
                    <option>Retrait en magasin</option>
                    <option>Livraison à domicile</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={cn(labelClassName, "mb-3 block")}>Wilaya</span>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className={fieldClassName}
                >
                  {Object.keys(defaultShippingTable).map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className={cn(labelClassName, "mb-3 block")}>
                  Notes de commande
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className={cn(fieldClassName, "resize-y")}
                />
              </label>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting
                  ? "Validation en cours..."
                  : `Valider et payer ${totalPrice.toLocaleString("fr-FR")} DA`}
              </Button>
            </form>
          </div>

          <aside className="border border-line bg-paper p-8 lg:sticky lg:top-36 lg:self-start">
            <h2 className="mb-8 font-display text-2xl text-ink">
              Résumé de la commande
            </h2>

            <SummaryRow
              label="Sous-total"
              value={`${cartTotal.toLocaleString("fr-FR")} DA`}
            />
            <SummaryRow
              label="Livraison"
              value={`${shippingCost.toLocaleString("fr-FR")} DA`}
            />
            <SummaryRow
              label="Total"
              value={`${totalPrice.toLocaleString("fr-FR")} DA`}
              emphasis
            />

            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow mb-5">Produits</p>
              <div className="space-y-4">
                {cart.map((cartItem) => {
                  const product = productsList.find((p) => p.id === cartItem.id);
                  if (!product) return null;
                  return (
                    <div
                      key={product.id}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="font-light text-muted">
                        {product.name}{" "}
                        <span className="text-muted-light">
                          ×{cartItem.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-ink">
                        {(product.price * cartItem.quantity).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        DA
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {submitError ? (
              <p className="mt-6 text-sm text-rose-600">{submitError}</p>
            ) : null}
          </aside>
        </div>
      </Container>
    </section>
  );
}

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

type ShippingRates = {
  home: number;
  desk: number;
};

type CustomerInsertResult = {
  id: string;
};

type OrderInsertResult = {
  id: string;
};

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
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [productsError, setProductsError] = useState<string | null>(null);

  const shippingTable: Record<string, ShippingRates> = {
    Alger: { home: 600, desk: 550 },
    Blida: { home: 700, desk: 650 },
    Boumerdes: { home: 700, desk: 650 },
    Tipaza: { home: 700, desk: 650 },
    Chlef: { home: 900, desk: 850 },
    "Oum El Bouaghi": { home: 900, desk: 850 },
    Batna: { home: 900, desk: 850 },
    Bejaia: { home: 900, desk: 850 },
    Bouira: { home: 900, desk: 850 },
    Tlemcen: { home: 900, desk: 850 },
    Tiaret: { home: 900, desk: 850 },
    "Tizi Ouzou": { home: 900, desk: 850 },
    Jijel: { home: 900, desk: 850 },
    Setif: { home: 900, desk: 850 },
    Saida: { home: 900, desk: 850 },
    Skikda: { home: 900, desk: 850 },
    "Sidi Bel Abbes": { home: 900, desk: 850 },
    Annaba: { home: 900, desk: 850 },
    Guelma: { home: 900, desk: 850 },
    Constantine: { home: 900, desk: 850 },
    Medea: { home: 900, desk: 850 },
    Mostaganem: { home: 900, desk: 850 },
    "M'Sila": { home: 900, desk: 850 },
    Mascara: { home: 900, desk: 850 },
    Oran: { home: 900, desk: 850 },
    "Bordj Bou Arreridj": { home: 900, desk: 850 },
    "El Tarf": { home: 900, desk: 850 },
    Tissemsilt: { home: 900, desk: 850 },
    Khenchela: { home: 900, desk: 850 },
    "Souk Ahras": { home: 900, desk: 850 },
    Mila: { home: 900, desk: 850 },
    "Ain Defla": { home: 900, desk: 850 },
    "Ain Temouchent": { home: 900, desk: 850 },
    Relizane: { home: 900, desk: 850 },
    Laghouat: { home: 1050, desk: 1000 },
    Biskra: { home: 1050, desk: 1000 },
    Tebessa: { home: 1050, desk: 1000 },
    Djelfa: { home: 1050, desk: 1000 },
    Ouargla: { home: 1050, desk: 1000 },
    "El Oued": { home: 1050, desk: 1000 },
    Ghardaia: { home: 1050, desk: 1000 },
    Adrar: { home: 1850, desk: 1750 },
    Bechar: { home: 1850, desk: 1750 },
    "El Bayadh": { home: 1850, desk: 1750 },
    Naama: { home: 1850, desk: 1750 },
    Tamanrasset: { home: 1850, desk: 1750 },
    Illizi: { home: 1850, desk: 1750 },
    Tindouf: { home: 1850, desk: 1750 },
  };

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

      const { data, error } = await supabase.from("products").select("*");
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

  const cartTotal = cart.reduce((sum, cartItem) => {
    const product = productsList.find((p) => p.id === cartItem.id);
    return sum + (product?.price || 0) * cartItem.quantity;
  }, 0);

  const shippingCost =
    deliveryMethod === "Retrait en magasin"
      ? shippingTable[wilaya]?.desk || 0
      : shippingTable[wilaya]?.home || 0;
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

    if (!supabase) {
      const message =
        "Configuration Supabase manquante. Impossible d'enregistrer la commande.";
      setSubmitError(message);
      alert(message);
      return;
    }

    setSubmitting(true);

    try {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          full_name: fullName,
          phone,
          email: email || null,
          wilaya,
          delivery_method: deliveryMethod,
          carrier,
          pickup_location: pickupLocation || null,
          notes: notes || null,
        })
        .select("id")
        .single<CustomerInsertResult>();

      if (customerError || !customer) {
        throw new Error(
          customerError
            ? `[customers] ${customerError.message}${customerError.details ? ` | details: ${customerError.details}` : ""}${customerError.hint ? ` | hint: ${customerError.hint}` : ""}`
            : "Erreur lors de la création du client.",
        );
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customer.id,
          subtotal: cartTotal,
          shipping: shippingCost,
          total: totalPrice,
        })
        .select("id")
        .single<OrderInsertResult>();

      if (orderError || !order) {
        throw new Error(
          orderError
            ? `[orders] ${orderError.message}${orderError.details ? ` | details: ${orderError.details}` : ""}${orderError.hint ? ` | hint: ${orderError.hint}` : ""}`
            : "Erreur lors de la création de la commande.",
        );
      }

      const items = cart
        .map((item) => {
          const product = productsList.find((p) => p.id === item.id);
          const numericProductId = Number(item.id);
          return {
            order_id: order.id,
            product_id: Number.isNaN(numericProductId) ? 0 : numericProductId,
            quantity: item.quantity,
            price_at_time: product?.price || 0,
          };
        })
        .filter((item) => item.product_id > 0);

      if (items.length === 0) {
        throw new Error("Aucun produit valide dans le panier.");
      }

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(items);

      if (orderItemsError) {
        throw new Error(
          `[order_items] ${orderItemsError.message}${orderItemsError.details ? ` | details: ${orderItemsError.details}` : ""}${orderItemsError.hint ? ` | hint: ${orderItemsError.hint}` : ""}`,
        );
      }

      setFinalOrderSummary({
        subtotal: cartTotal,
        shipping: shippingCost,
        total: totalPrice,
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
      console.error("Checkout submit error:", error);
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
                <option>Alger</option>
                <option>Blida</option>
                <option>Boumerdes</option>
                <option>Tipaza</option>
                <option>Chlef</option>
                <option>Oum El Bouaghi</option>
                <option>Batna</option>
                <option>Bejaia</option>
                <option>Bouira</option>
                <option>Tlemcen</option>
                <option>Tiaret</option>
                <option>Tizi Ouzou</option>
                <option>Jijel</option>
                <option>Setif</option>
                <option>Saida</option>
                <option>Skikda</option>
                <option>Sidi Bel Abbes</option>
                <option>Annaba</option>
                <option>Guelma</option>
                <option>Constantine</option>
                <option>Medea</option>
                <option>Mostaganem</option>
                <option>M'Sila</option>
                <option>Mascara</option>
                <option>Oran</option>
                <option>Bordj Bou Arreridj</option>
                <option>El Tarf</option>
                <option>Tissemsilt</option>
                <option>Khenchela</option>
                <option>Souk Ahras</option>
                <option>Mila</option>
                <option>Ain Defla</option>
                <option>Ain Temouchent</option>
                <option>Relizane</option>
                <option>Laghouat</option>
                <option>Biskra</option>
                <option>Tebessa</option>
                <option>Djelfa</option>
                <option>Ouargla</option>
                <option>El Oued</option>
                <option>Ghardaia</option>
                <option>Adrar</option>
                <option>Bechar</option>
                <option>El Bayadh</option>
                <option>Naama</option>
                <option>Tamanrasset</option>
                <option>Illizi</option>
                <option>Tindouf</option>
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
          {productsError ? <p className="form-error">{productsError}</p> : null}
          {submitError ? <p className="form-error">{submitError}</p> : null}
        </div>
      </div>
    </div>
  );
}

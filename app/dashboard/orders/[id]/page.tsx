"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  wilaya?: string;
  delivery_method?: string;
  carrier?: string;
  pickup_location?: string;
  notes?: string;
};

type Product = {
  id: number;
  name: string;
  image: string;
  category: string;
};

type OrderDetail = {
  id: string;
  customer_id: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at?: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price_at_time: number;
  product?: Product;
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = useMemo(() => String(params?.id || ""), [params]);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!orderId) return;
    void loadDetails();
  }, [orderId]);

  async function loadDetails() {
    setLoading(true);
    setErrorMessage("");

    if (!supabase) {
      setErrorMessage("Supabase non configure pour charger cette commande.");
      setLoading(false);
      return;
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, subtotal, shipping, total, status, created_at")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !orderData) {
      setErrorMessage("Commande introuvable.");
      setLoading(false);
      return;
    }

    const mappedOrder: OrderDetail = {
      id: String(orderData.id),
      customer_id: String(orderData.customer_id || ""),
      subtotal: Number(orderData.subtotal) || 0,
      shipping: Number(orderData.shipping) || 0,
      total: Number(orderData.total) || 0,
      status: String(orderData.status || "pending"),
      created_at: orderData.created_at
        ? String(orderData.created_at)
        : undefined,
    };

    const [
      { data: customerData },
      { data: orderItemsData, error: orderItemsError },
      { data: productsData },
    ] = await Promise.all([
      supabase
        .from("customers")
        .select(
          "id, full_name, phone, email, wilaya, delivery_method, carrier, pickup_location, notes",
        )
        .eq("id", mappedOrder.customer_id)
        .maybeSingle(),
      supabase
        .from("order_items")
        .select("id, order_id, product_id, quantity, price_at_time")
        .eq("order_id", orderId),
      supabase.from("products").select("id, name, image, category"),
    ]);

    if (orderItemsError || !Array.isArray(orderItemsData)) {
      setErrorMessage("Impossible de charger les details de la commande.");
      setOrder(mappedOrder);
      setCustomer(
        customerData
          ? {
              id: String(customerData.id),
              full_name: String(customerData.full_name || ""),
              phone: String(customerData.phone || ""),
              email: customerData.email
                ? String(customerData.email)
                : undefined,
              wilaya: customerData.wilaya
                ? String(customerData.wilaya)
                : undefined,
              delivery_method: customerData.delivery_method
                ? String(customerData.delivery_method)
                : undefined,
              carrier: customerData.carrier
                ? String(customerData.carrier)
                : undefined,
              pickup_location: customerData.pickup_location
                ? String(customerData.pickup_location)
                : undefined,
              notes: customerData.notes
                ? String(customerData.notes)
                : undefined,
            }
          : null,
      );
      setItems([]);
      setLoading(false);
      return;
    }

    const products = Array.isArray(productsData)
      ? (productsData.map((item) => ({
          id: Number(item.id) || 0,
          name: String(item.name || ""),
          image: String(item.image || ""),
          category: String(item.category || ""),
        })) as Product[])
      : [];

    const productMap = new Map(products.map((item) => [item.id, item]));

    const mappedItems = orderItemsData.map((item) => ({
      id: String(item.id),
      order_id: String(item.order_id || ""),
      product_id: Number(item.product_id) || 0,
      quantity: Number(item.quantity) || 0,
      price_at_time: Number(item.price_at_time) || 0,
      product: productMap.get(Number(item.product_id) || 0),
    })) as OrderItem[];

    setOrder(mappedOrder);
    setCustomer(
      customerData
        ? {
            id: String(customerData.id),
            full_name: String(customerData.full_name || ""),
            phone: String(customerData.phone || ""),
            email: customerData.email ? String(customerData.email) : undefined,
            wilaya: customerData.wilaya
              ? String(customerData.wilaya)
              : undefined,
            delivery_method: customerData.delivery_method
              ? String(customerData.delivery_method)
              : undefined,
            carrier: customerData.carrier
              ? String(customerData.carrier)
              : undefined,
            pickup_location: customerData.pickup_location
              ? String(customerData.pickup_location)
              : undefined,
            notes: customerData.notes ? String(customerData.notes) : undefined,
          }
        : null,
    );
    setItems(mappedItems);
    setLoading(false);
  }

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin-login");
    router.refresh();
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Espace administrateur</p>
          <h1>Détails de la commande</h1>
          <p className="admin-subtitle">
            Visualisez chaque produit avec image, quantité et prix.
          </p>
        </div>
        <button type="button" className="admin-logout-btn" onClick={onLogout}>
          Deconnexion
        </button>
      </div>

      <div className="admin-jump-nav" aria-label="Navigation admin">
        <Link className="admin-jump-link" href="/dashboard">
          Produits
        </Link>
        <Link
          className="admin-jump-link admin-jump-link-primary"
          href="/dashboard/orders"
        >
          Retour aux commandes
        </Link>
      </div>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      {loading ? (
        <div className="admin-card">
          <div className="page-loader" role="status" aria-live="polite">
            <span className="loader-dot" aria-hidden="true"></span>
            <p>Chargement des détails...</p>
          </div>
        </div>
      ) : order ? (
        <>
          <div className="admin-card order-meta-card">
            <h2>Informations de la commande</h2>
            <div className="order-meta-grid">
              <p>
                <strong>Statut:</strong>{" "}
                {statusLabels[order.status] || order.status}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {order.created_at ? order.created_at.slice(0, 16) : "-"}
              </p>
              <p>
                <strong>Sous-total:</strong>{" "}
                {order.subtotal.toLocaleString("fr-FR")} DA
              </p>
              <p>
                <strong>Livraison:</strong>{" "}
                {order.shipping.toLocaleString("fr-FR")} DA
              </p>
              <p>
                <strong>Total:</strong> {order.total.toLocaleString("fr-FR")} DA
              </p>
            </div>
          </div>

          <div className="admin-card order-meta-card">
            <h2>Détails du client</h2>
            <div className="order-meta-grid">
              <p>
                <strong>Nom:</strong> {customer?.full_name || "-"}
              </p>
              <p>
                <strong>Téléphone:</strong> {customer?.phone || "-"}
              </p>
              <p>
                <strong>Email:</strong> {customer?.email || "-"}
              </p>
              <p>
                <strong>Wilaya:</strong> {customer?.wilaya || "-"}
              </p>
              <p>
                <strong>Livraison:</strong> {customer?.delivery_method || "-"}
              </p>
              <p>
                <strong>Transporteur:</strong> {customer?.carrier || "-"}
              </p>
              {customer?.pickup_location ? (
                <p>
                  <strong>Point retrait:</strong> {customer.pickup_location}
                </p>
              ) : null}
              <p>
                <strong>Notes:</strong> {customer?.notes || "-"}
              </p>
            </div>
          </div>

          <div className="admin-card">
            <h2>Produits de la commande</h2>
            <div className="order-items-grid">
              {items.map((item) => (
                <article key={item.id} className="order-item-card">
                  <div className="order-item-image-wrap">
                    <img
                      className="order-item-image"
                      src={item.product?.image || ""}
                      alt={item.product?.name || `Produit ${item.product_id}`}
                    />
                  </div>
                  <div className="order-item-body">
                    <h3>{item.product?.name || "Produit"}</h3>
                    <p>Catégorie: {item.product?.category || "-"}</p>
                    <p>Quantité: {item.quantity}</p>
                    <p>
                      Prix unitaire:{" "}
                      {item.price_at_time.toLocaleString("fr-FR")} DA
                    </p>
                    <p className="order-item-total">
                      Total de la ligne:{" "}
                      {(item.price_at_time * item.quantity).toLocaleString(
                        "fr-FR",
                      )}{" "}
                      DA
                    </p>
                  </div>
                </article>
              ))}

              {items.length === 0 ? (
                <p className="admin-empty-state">
                  Aucun article dans cette commande.
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

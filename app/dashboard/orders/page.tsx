"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
};

type Order = {
  id: string;
  customer_id: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at?: string;
  customer?: Customer;
};

const orderStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

const sampleOrders: Order[] = [
  {
    id: "sample-order-1",
    customer_id: "sample-customer-1",
    subtotal: 1200,
    shipping: 550,
    total: 1750,
    status: "pending",
    created_at: "2026-03-24 16:21:00",
    customer: {
      id: "sample-customer-1",
      full_name: "Client Test",
      phone: "0550000000",
      email: "client@test.com",
    },
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setErrorMessage("");

    if (!supabase) {
      setOrders(sampleOrders);
      setLoading(false);
      return;
    }

    const [orderResult, customerResult] = await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, customer_id, subtotal, shipping, total, status, created_at",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("customers")
        .select("id, full_name, phone, email")
        .order("created_at", { ascending: false }),
    ]);

    if (
      orderResult.error ||
      customerResult.error ||
      !Array.isArray(orderResult.data) ||
      !Array.isArray(customerResult.data)
    ) {
      setOrders(sampleOrders);
      setLoading(false);
      return;
    }

    const customers = customerResult.data.map((item) => ({
      id: String(item.id),
      full_name: String(item.full_name || ""),
      phone: String(item.phone || ""),
      email: item.email ? String(item.email) : undefined,
    })) as Customer[];

    const customerMap = new Map(customers.map((item) => [item.id, item]));

    const mappedOrders = orderResult.data.map((item) => ({
      id: String(item.id),
      customer_id: String(item.customer_id || ""),
      subtotal: Number(item.subtotal) || 0,
      shipping: Number(item.shipping) || 0,
      total: Number(item.total) || 0,
      status: String(item.status || "pending"),
      created_at: item.created_at ? String(item.created_at) : undefined,
      customer: customerMap.get(String(item.customer_id || "")),
    })) as Order[];

    setOrders(mappedOrders);
    setLoading(false);
  }

  const onUpdateOrderStatus = async (order: Order, status: string) => {
    setUpdatingOrderId(order.id);
    setErrorMessage("");

    try {
      if (!supabase) {
        setOrders((current) =>
          current.map((item) =>
            item.id === order.id ? { ...item, status } : item,
          ),
        );
        return;
      }

      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order.id);

      if (error) {
        throw new Error(error.message);
      }

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, status } : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Mise a jour impossible.";
      setErrorMessage(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const onDeleteOrder = async (order: Order) => {
    const customerName = order.customer?.full_name || "ce client";
    const confirmation = window.prompt(
      `Pour supprimer la commande de ${customerName}, tapez SUPPRIMER COMMANDE.`,
    );

    if (confirmation !== "SUPPRIMER COMMANDE") {
      return;
    }

    setDeletingOrderId(order.id);
    setErrorMessage("");

    try {
      if (!supabase) {
        setOrders((current) => current.filter((item) => item.id !== order.id));
        return;
      }

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      if (error) {
        throw new Error(error.message);
      }

      setOrders((current) => current.filter((item) => item.id !== order.id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Suppression commande impossible.";
      setErrorMessage(message);
    } finally {
      setDeletingOrderId(null);
    }
  };

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
          <h1>Gestion des Commandes</h1>
          <p className="admin-subtitle">
            Ouvrez une commande pour voir les détails, photos et quantités.
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
          Commandes
        </Link>
      </div>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      <div className="admin-card admin-orders-card">
        <h2>Commandes ({orders.length})</h2>

        {loading ? (
          <div className="page-loader" role="status" aria-live="polite">
            <span className="loader-dot" aria-hidden="true"></span>
            <p>Chargement des commandes...</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Créée le</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.customer?.full_name || "Client inconnu"}</td>
                    <td>{order.customer?.phone || "-"}</td>
                    <td>{order.total.toLocaleString("fr-FR")} DA</td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(e) =>
                          onUpdateOrderStatus(order, e.target.value)
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status] || status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {order.created_at ? order.created_at.slice(0, 16) : "-"}
                    </td>
                    <td>
                      <Link
                        className="admin-view-btn"
                        href={`/dashboard/orders/${order.id}`}
                      >
                        Voir les détails
                      </Link>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        disabled={deletingOrderId === order.id}
                        onClick={() => onDeleteOrder(order)}
                      >
                        {deletingOrderId === order.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

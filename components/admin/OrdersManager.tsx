"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import {
  deleteOrder,
  exportOrdersCsv,
  updateOrderStatus,
} from "@/lib/actions/orders";

type Order = {
  id: string;
  status: string;
  total: { toString(): string } | number;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
  };
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function OrdersManager({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function onExport() {
    startTransition(async () => {
      const csv = await exportOrdersCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `commandes-maxi-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Panier</p>
          <h2 className="mt-2 font-display text-4xl text-ink">Commandes</h2>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={onExport}
          className="rounded-lg border border-line px-4 py-2 text-sm"
        >
          Exporter CSV
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher client, téléphone, ID..."
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        >
          <option value="ALL">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucune commande" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-line/70">
                  <td className="px-4 py-3">{order.customer.fullName}</td>
                  <td className="px-4 py-3">
                    <p>{order.customer.phone}</p>
                    <p className="text-xs text-muted">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {Number(order.total).toLocaleString("fr-FR")} DA
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      className="rounded border border-line px-2 py-1 text-xs"
                      onChange={(e) =>
                        startTransition(async () => {
                          await updateOrderStatus(order.id, e.target.value);
                          setOrders((current) =>
                            current.map((o) =>
                              o.id === order.id
                                ? { ...o, status: e.target.value }
                                : o,
                            ),
                          );
                        })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs underline"
                      >
                        Détails
                      </Link>
                      <button
                        type="button"
                        className="text-xs text-rose-600"
                        onClick={() => {
                          if (!confirm("Supprimer cette commande ?")) return;
                          startTransition(async () => {
                            await deleteOrder(order.id);
                            setOrders((c) => c.filter((o) => o.id !== order.id));
                          });
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

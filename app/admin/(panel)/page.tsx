import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDashboardStats } from "@/lib/actions/dashboard";

function formatDzd(value: number) {
  return `${value.toLocaleString("fr-FR")} DA`;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
          Vue d&apos;ensemble
        </p>
        <h2 className="mt-2 font-display text-4xl text-ink">Tableau de bord</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produits" value={String(stats.productCount)} />
        <StatCard label="Commandes" value={String(stats.orderCount)} hint={`${stats.pendingOrders} en attente`} />
        <StatCard label="Revenu total" value={formatDzd(stats.totalRevenue)} />
        <StatCard label="Revenu (30 jours)" value={formatDzd(stats.monthlyRevenue)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl">Commandes récentes</h3>
            <Link href="/admin/orders" className="text-xs uppercase tracking-[0.16em] text-muted hover:text-ink">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted">Aucune commande pour le moment.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between rounded-lg border border-line px-4 py-3 transition-colors hover:bg-paper"
                >
                  <div>
                    <p className="text-sm font-medium">{order.customer.fullName}</p>
                    <p className="text-xs text-muted">
                      {order.createdAt.toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="mt-1 text-sm">{formatDzd(Number(order.total))}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-6">
          <h3 className="mb-4 font-display text-2xl">Activité récente</h3>
          <div className="space-y-3">
            {stats.activity.length === 0 ? (
              <p className="text-sm text-muted">Aucune activité enregistrée.</p>
            ) : (
              stats.activity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-line px-4 py-3 text-sm"
                >
                  <p>
                    <span className="font-medium">{entry.admin?.name ?? "Système"}</span>{" "}
                    — {entry.action} {entry.entity}
                  </p>
                  <p className="text-xs text-muted">
                    {entry.createdAt.toLocaleString("fr-FR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-line bg-white p-6">
        <h3 className="mb-4 font-display text-2xl">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-lg bg-ink px-4 py-2 text-sm text-white">
            Nouveau produit
          </Link>
          <Link href="/admin/orders" className="rounded-lg border border-line px-4 py-2 text-sm">
            Gérer les commandes
          </Link>
          <Link href="/admin/content" className="rounded-lg border border-line px-4 py-2 text-sm">
            Modifier le contenu
          </Link>
        </div>
      </section>
    </div>
  );
}

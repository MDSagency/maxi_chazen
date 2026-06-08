import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminOrder } from "@/lib/actions/orders";

type Params = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Params) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/orders" className="text-xs uppercase tracking-[0.16em] text-muted">
          ← Retour aux commandes
        </Link>
        <h2 className="mt-3 font-display text-4xl text-ink">Commande #{order.id.slice(-8)}</h2>
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-sm text-muted">
            {order.createdAt.toLocaleString("fr-FR")}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-white p-6">
          <h3 className="font-display text-2xl">Client</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-muted">Nom</dt><dd>{order.customer.fullName}</dd></div>
            <div><dt className="text-muted">Téléphone</dt><dd>{order.customer.phone}</dd></div>
            <div><dt className="text-muted">Email</dt><dd>{order.customer.email ?? "—"}</dd></div>
            <div><dt className="text-muted">Wilaya</dt><dd>{order.customer.wilaya}</dd></div>
            <div><dt className="text-muted">Adresse</dt><dd>{order.customer.address ?? "—"}</dd></div>
            <div><dt className="text-muted">Livraison</dt><dd>{order.customer.deliveryMethod ?? "—"}</dd></div>
            <div><dt className="text-muted">Notes</dt><dd>{order.customer.notes ?? "—"}</dd></div>
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-white p-6">
          <h3 className="font-display text-2xl">Montants</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Sous-total</dt><dd>{Number(order.subtotal).toLocaleString("fr-FR")} DA</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd>{Number(order.shipping).toLocaleString("fr-FR")} DA</dd></div>
            <div className="flex justify-between border-t border-line pt-2 font-medium"><dt>Total</dt><dd>{Number(order.total).toLocaleString("fr-FR")} DA</dd></div>
          </dl>
        </section>
      </div>

      <section className="rounded-xl border border-line bg-white p-6">
        <h3 className="font-display text-2xl">Produits commandés</h3>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => {
            const image = item.product.images[0]?.url;
            return (
              <div key={item.id} className="flex items-center gap-4 border-b border-line pb-4 last:border-0">
                {image ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image src={image} alt="" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-paper" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted">
                    {Number(item.unitPrice).toLocaleString("fr-FR")} DA × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(Number(item.unitPrice) * item.quantity).toLocaleString("fr-FR")} DA
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

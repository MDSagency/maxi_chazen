"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { orderStatusSchema } from "@/lib/validations/order";
import { logActivity } from "@/lib/activity";
import type { OrderStatus } from "@prisma/client";

export async function getAdminOrders(filters?: {
  search?: string;
  status?: OrderStatus | "ALL";
}) {
  await requireAdmin();

  const where: {
    status?: OrderStatus;
    OR?: Array<
      | { customer: { fullName: { contains: string; mode: "insensitive" } } }
      | { customer: { phone: { contains: string; mode: "insensitive" } } }
      | { id: { contains: string; mode: "insensitive" } }
    >;
  } = {};

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { customer: { fullName: { contains: q, mode: "insensitive" } } },
      { customer: { phone: { contains: q, mode: "insensitive" } } },
      { id: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.order.findMany({
    where,
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: { include: { images: { orderBy: { sortOrder: "asc" } } } },
        },
      },
    },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await requireAdmin();
  const parsed = orderStatusSchema.parse(status);

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed },
  });

  await logActivity({
    adminId: session.user.id,
    action: "status_update",
    entity: "order",
    entityId: id,
    metadata: { status: parsed },
  });

  revalidatePath("/admin/orders");
  return order;
}

export async function deleteOrder(id: string) {
  const session = await requireAdmin();
  await prisma.order.delete({ where: { id } });

  await logActivity({
    adminId: session.user.id,
    action: "delete",
    entity: "order",
    entityId: id,
  });

  revalidatePath("/admin/orders");
}

export async function exportOrdersCsv() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "id",
    "date",
    "client",
    "telephone",
    "email",
    "wilaya",
    "statut",
    "sous_total",
    "livraison",
    "total",
    "articles",
  ].join(",");

  const rows = orders.map((order) => {
    const items = order.items
      .map((i) => `${i.productName} x${i.quantity}`)
      .join(" | ");
    return [
      order.id,
      order.createdAt.toISOString(),
      `"${order.customer.fullName.replace(/"/g, '""')}"`,
      order.customer.phone,
      order.customer.email ?? "",
      order.customer.wilaya,
      order.status,
      order.subtotal.toString(),
      order.shipping.toString(),
      order.total.toString(),
      `"${items.replace(/"/g, '""')}"`,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

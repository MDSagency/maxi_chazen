"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";

export async function getDashboardStats() {
  await requireAdmin();

  const [productCount, orderCount, revenueAgg, recentOrders, activity] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),
      prisma.activityLog.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { name: true, email: true } } },
      }),
    ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const monthlyRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { not: "CANCELLED" },
    },
  });

  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });

  return {
    productCount,
    orderCount,
    pendingOrders,
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    monthlyRevenue: Number(monthlyRevenue._sum.total ?? 0),
    recentOrders,
    activity,
  };
}

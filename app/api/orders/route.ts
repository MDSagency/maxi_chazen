import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/order";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getShippingCost } from "@/lib/shippingRates";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const productIds = data.items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Un ou plusieurs produits sont invalides." },
      { status: 400 },
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId)!;
    if (product.stockQuantity < item.quantity) {
      throw new Error(`Stock insuffisant pour ${product.name}.`);
    }
    const unitPrice = Number(product.price);
    subtotal += unitPrice * item.quantity;
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
    };
  });

  const shipping = getShippingCost(
    data.wilaya,
    data.deliveryMethod ?? "Retrait en magasin",
  );
  const total = subtotal + shipping;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || null,
          wilaya: data.wilaya,
          address: data.address?.trim() || null,
          deliveryMethod: data.deliveryMethod || null,
          carrier: data.carrier || null,
          pickupLocation: data.pickupLocation?.trim() || null,
          notes: data.notes?.trim() || null,
        },
      });

      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          subtotal,
          shipping,
          total,
          status: "PENDING",
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      return order;
    });

    return NextResponse.json({
      ok: true,
      orderId: result.id,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la commande.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

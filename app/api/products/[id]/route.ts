import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      published: true,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    in_stock: product.stockQuantity > 0,
    stockQuantity: product.stockQuantity,
    category: product.category?.name ?? "",
    categorySlug: product.category?.slug ?? "",
    featured: product.featured,
    image: product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? "",
    images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    created_at: product.createdAt.toISOString(),
  });
}

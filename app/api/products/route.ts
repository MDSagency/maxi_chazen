import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured") === "true";
  const categorySlug = searchParams.get("category");
  const limit = Number(searchParams.get("limit") || 0);

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(featured ? { featured: true } : {}),
      ...(categorySlug
        ? { category: { slug: categorySlug } }
        : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  const mapped = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    shortDescription: p.shortDescription,
    price: Number(p.price),
    in_stock: p.stockQuantity > 0,
    stockQuantity: p.stockQuantity,
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    featured: p.featured,
    image: p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? "",
    images: p.images.map((i) => i.url),
    created_at: p.createdAt.toISOString(),
  }));

  return NextResponse.json(mapped);
}

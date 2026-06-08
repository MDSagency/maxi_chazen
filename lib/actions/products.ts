"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { productSchema } from "@/lib/validations/product";
import { uniqueSlug } from "@/lib/utils/slug";
import { logActivity } from "@/lib/activity";
import { deleteFromR2 } from "@/lib/r2";

export async function getAdminProducts(filters?: {
  search?: string;
  categoryId?: string;
  published?: "all" | "published" | "draft";
}) {
  await requireAdmin();

  const where: {
    OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { slug: { contains: string; mode: "insensitive" } }>;
    categoryId?: string;
    published?: boolean;
  } = {};

  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.published === "published") where.published = true;
  if (filters?.published === "draft") where.published = false;

  return prisma.product.findMany({
    where,
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createProduct(input: unknown) {
  const session = await requireAdmin();
  const data = productSchema.parse(input);

  const slug = await uniqueSlug(data.slug || data.name, async (s) => {
    const existing = await prisma.product.findUnique({ where: { slug: s } });
    return Boolean(existing);
  });

  const product = await prisma.product.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      shortDescription: data.shortDescription?.trim() || null,
      price: data.price,
      stockQuantity: data.stockQuantity,
      categoryId: data.categoryId || null,
      featured: data.featured,
      published: data.published,
    },
  });

  await logActivity({
    adminId: session.user.id,
    action: "create",
    entity: "product",
    entityId: product.id,
    metadata: { name: product.name },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function updateProduct(id: string, input: unknown) {
  const session = await requireAdmin();
  const data = productSchema.parse(input);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new Error("Produit introuvable.");

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await uniqueSlug(data.slug, async (s) => {
      const found = await prisma.product.findFirst({
        where: { slug: s, NOT: { id } },
      });
      return Boolean(found);
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      shortDescription: data.shortDescription?.trim() || null,
      price: data.price,
      stockQuantity: data.stockQuantity,
      categoryId: data.categoryId || null,
      featured: data.featured,
      published: data.published,
    },
  });

  await logActivity({
    adminId: session.user.id,
    action: "update",
    entity: "product",
    entityId: product.id,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function deleteProduct(id: string) {
  const session = await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) throw new Error("Produit introuvable.");

  await prisma.product.delete({ where: { id } });

  for (const image of product.images) {
    if (image.storageKey) await deleteFromR2(image.storageKey);
  }

  await logActivity({
    adminId: session.user.id,
    action: "delete",
    entity: "product",
    entityId: id,
    metadata: { name: product.name },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductPublished(id: string) {
  const session = await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produit introuvable.");

  const updated = await prisma.product.update({
    where: { id },
    data: { published: !product.published },
  });

  await logActivity({
    adminId: session.user.id,
    action: updated.published ? "publish" : "unpublish",
    entity: "product",
    entityId: id,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return updated;
}

export async function reorderProductImages(
  productId: string,
  imageIds: string[],
) {
  await requireAdmin();

  await prisma.$transaction(
    imageIds.map((imageId, index) =>
      prisma.productImage.update({
        where: { id: imageId, productId },
        data: {
          sortOrder: index,
          isPrimary: index === 0,
        },
      }),
    ),
  );

  revalidatePath("/admin/products");
}

export async function deleteProductImage(imageId: string) {
  const session = await requireAdmin();
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) throw new Error("Image introuvable.");

  await prisma.productImage.delete({ where: { id: imageId } });
  if (image.storageKey) await deleteFromR2(image.storageKey);

  await logActivity({
    adminId: session.user.id,
    action: "delete_image",
    entity: "product",
    entityId: image.productId,
  });

  revalidatePath("/admin/products");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { categorySchema } from "@/lib/validations/category";
import { uniqueSlug } from "@/lib/utils/slug";
import { logActivity } from "@/lib/activity";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getAdminCategories() {
  await requireAdmin();
  return getCategories();
}

export async function createCategory(input: unknown) {
  const session = await requireAdmin();
  const data = categorySchema.parse(input);

  const slug = await uniqueSlug(data.slug || data.name, async (s) => {
    const existing = await prisma.category.findUnique({ where: { slug: s } });
    return Boolean(existing);
  });

  const category = await prisma.category.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      sortOrder: data.sortOrder,
    },
  });

  await logActivity({
    adminId: session.user.id,
    action: "create",
    entity: "category",
    entityId: category.id,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function updateCategory(id: string, input: unknown) {
  const session = await requireAdmin();
  const data = categorySchema.parse(input);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error("Catégorie introuvable.");

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await uniqueSlug(data.slug, async (s) => {
      const found = await prisma.category.findFirst({
        where: { slug: s, NOT: { id } },
      });
      return Boolean(found);
    });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      sortOrder: data.sortOrder,
    },
  });

  await logActivity({
    adminId: session.user.id,
    action: "update",
    entity: "category",
    entityId: category.id,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function deleteCategory(id: string) {
  const session = await requireAdmin();

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(
      "Impossible de supprimer une catégorie contenant des produits.",
    );
  }

  await prisma.category.delete({ where: { id } });

  await logActivity({
    adminId: session.user.id,
    action: "delete",
    entity: "category",
    entityId: id,
  });

  revalidatePath("/admin/categories");
}

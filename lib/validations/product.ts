import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nom requis."),
  slug: z.string().optional(),
  description: z.string().min(10, "Description trop courte."),
  shortDescription: z.string().max(300).optional(),
  price: z.coerce.number().min(0, "Prix invalide."),
  stockQuantity: z.coerce.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.enum(["all", "published", "draft"]).optional(),
});

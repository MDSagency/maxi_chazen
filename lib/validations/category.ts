import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nom requis."),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

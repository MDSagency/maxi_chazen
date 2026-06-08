import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis."),
  phone: z.string().min(8, "Téléphone invalide."),
  email: z.string().email().optional().or(z.literal("")),
  wilaya: z.string().min(2),
  address: z.string().optional(),
  deliveryMethod: z.string().optional(),
  carrier: z.string().optional(),
  pickupLocation: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, "Panier vide."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

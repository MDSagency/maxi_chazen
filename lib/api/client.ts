import type { Product } from "@/lib/types";

export async function fetchProducts(options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options?.featured) params.set("featured", "true");
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.category) params.set("category", options.category);

  const response = await fetch(`/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) return [];
  return response.json() as Promise<Product[]>;
}

export async function fetchProduct(idOrSlug: string): Promise<Product | null> {
  const response = await fetch(`/api/products/${idOrSlug}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json() as Promise<Product>;
}

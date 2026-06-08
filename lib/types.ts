export type Product = {
  id: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  name: string;
  price: number;
  in_stock: boolean;
  stockQuantity?: number;
  image: string;
  images?: string[] | Array<{ url: string; alt?: string | null }>;
  created_at?: string;
  description?: string;
  shortDescription?: string | null;
  featured?: boolean;
};

export type CartItem = {
  id: string;
  quantity: number;
};

export function mapProduct(item: Record<string, unknown>): Product | null {
  const id = String(item.id || "").trim();
  if (!id) return null;

  return {
    id,
    category: String(item.category || ""),
    name: String(item.name || ""),
    price: Number(item.price) || 0,
    in_stock:
      item.in_stock === true ||
      item.in_stock === "true" ||
      item.in_stock === 1,
    image: String(item.image || ""),
    created_at: item.created_at ? String(item.created_at) : undefined,
    description: item.description ? String(item.description) : undefined,
  };
}

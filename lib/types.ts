export type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
  in_stock: boolean;
  image: string;
  created_at?: string;
  description?: string;
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

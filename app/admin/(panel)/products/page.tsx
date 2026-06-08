import ProductsManager from "@/components/admin/ProductsManager";
import { getAdminProducts } from "@/lib/actions/products";
import { getAdminCategories } from "@/lib/actions/categories";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <ProductsManager
      initialProducts={JSON.parse(JSON.stringify(products))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}

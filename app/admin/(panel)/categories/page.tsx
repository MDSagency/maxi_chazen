import CategoriesManager from "@/components/admin/CategoriesManager";
import { getAdminCategories } from "@/lib/actions/categories";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <CategoriesManager
      initialCategories={JSON.parse(JSON.stringify(categories))}
    />
  );
}

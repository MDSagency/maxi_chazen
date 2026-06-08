import OrdersManager from "@/components/admin/OrdersManager";
import { getAdminOrders } from "@/lib/actions/orders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return (
    <OrdersManager
      initialOrders={JSON.parse(JSON.stringify(orders))}
    />
  );
}

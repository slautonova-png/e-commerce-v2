import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Autonova",
  description: "Manage your store",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get stats
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: orders } = await supabase
    .from("orders")
    .select("total, status")
    .eq("payment_status", "paid");

  const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      name: "Total Products",
      value: productsCount || 0,
      icon: Package,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: ordersCount || 0,
      icon: ShoppingCart,
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      change: "+23%",
      changeType: "positive",
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      change: "-2%",
      changeType: "negative",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:text-primary/80"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        order.status === "delivered"
                          ? "bg-green-500/10 text-green-500"
                          : order.status === "cancelled"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        order.payment_status === "paid"
                          ? "bg-green-500/10 text-green-500"
                          : order.payment_status === "failed"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-foreground">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

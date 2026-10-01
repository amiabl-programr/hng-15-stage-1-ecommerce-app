import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Roofing Construction Shop",
};

export default async function AdminOverviewPage() {
  const adminDb = createAdminClient();

  // Load KPI data
  const [
    { data: orders },
    { data: products },
    { data: variants },
    { data: categories },
  ] = await Promise.all([
    adminDb.from("orders").select("*").order("created_at", { ascending: false }),
    adminDb.from("products").select("id, is_active"),
    adminDb.from("product_variants").select("id, stock_quantity"),
    adminDb.from("categories").select("id"),
  ]);

  const orderList = orders || [];
  const productList = products || [];
  const variantList = variants || [];

  const totalRevenue = orderList
    .filter((o) => o.status === "paid" || o.status === "completed" || o.status === "shipped")
    .reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

  const lowStockCount = variantList.filter((v) => v.stock_quantity <= 200).length;

  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Operations Center
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Admin Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time summary of factory orders, sheet inventory, and commercial dispatches.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Cleared &amp; in-transit orders</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">{orderList.length}</span>
          <span className="text-[11px] text-slate-400">All registered job sheets</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">{productList.length}</span>
          <span className="text-[11px] text-slate-400">In {categories?.length || 0} categories</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Variants</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">{lowStockCount}</span>
          <span className="text-[11px] text-red-400 font-medium">Reorder recommended</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest material orders submitted by contractors and homeowners.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Order Ref</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Destination</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orderList.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white">
                    {order.order_number}
                  </td>
                  <td className="py-4 px-6 text-slate-200">
                    <span className="font-semibold block">{order.customer_name}</span>
                    <span className="text-slate-500 text-[11px]">{order.customer_email}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {order.delivery_address?.city}, {order.delivery_address?.state}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full capitalize font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-white">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/orders?highlight=${order.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-medium border border-slate-700"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
              {orderList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No orders have been recorded yet.
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

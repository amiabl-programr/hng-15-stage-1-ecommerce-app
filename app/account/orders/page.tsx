import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PackageX, ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Order History | Roofing Construction Shop",
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account/orders");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(count)
    `)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Your Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track live dispatch status, delivery schedules, and payment receipts.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
        >
          <span>New Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-base">
                    {order.order_number}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Placed on {formatDateTime(order.created_at)}</span>
                  <span>Method: {order.payment_method.replace(/_/g, " ")}</span>
                  <span className="capitalize">Payment: {order.payment_status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-base font-black text-amber-500 block">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You have not placed any orders yet. Select your roofing sheets and accessories to begin.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs"
            >
              <span>Explore Materials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

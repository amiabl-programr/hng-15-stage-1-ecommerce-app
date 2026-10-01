import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Package, Shield, User, ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "Account Overview | Roofing Construction Shop",
};

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Welcome, {profile?.full_name || user.email?.split("@")[0]}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account contact information, site delivery records, and active roofing orders.
        </p>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Profile Role</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-white capitalize block">
            {profile?.role || "Customer"}
          </span>
          <span className="text-xs text-slate-500 block">{user.email}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Recent Orders</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-white block">
            {recentOrders?.length || 0} Placed
          </span>
          <Link
            href="/account/orders"
            className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Custom Quotes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-white block">Fabrication</span>
          <Link
            href="/fabrication"
            className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Submit New Roof Plan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {order.order_number}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full capitalize bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Placed on {formatDateTime(order.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="font-extrabold text-amber-500 text-sm">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm space-y-3">
            <p>You haven&apos;t placed any orders with this account yet.</p>
            <Link
              href="/products"
              className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Browse Catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

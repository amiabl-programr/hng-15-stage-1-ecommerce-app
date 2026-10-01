import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { OrderStatusDropdown } from "@/components/admin/OrderStatusDropdown";
import { Ruler, Truck, Mail, Phone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Manage Orders | Admin Portal",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const adminDb = createAdminClient();

  let query = adminDb
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders } = await query;
  const orderList = orders || [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Order Fulfillment
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Orders &amp; Dispatch Queue</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review specifications, customer delivery addresses, and advance order statuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { label: "All Orders", val: "all" },
          { label: "Pending", val: "pending" },
          { label: "Paid", val: "paid" },
          { label: "In Production", val: "processing" },
          { label: "Ready for Delivery", val: "ready_for_delivery" },
          { label: "Shipped", val: "shipped" },
          { label: "Completed", val: "completed" },
          { label: "Cancelled", val: "cancelled" },
        ].map((tab) => (
          <Link
            key={tab.val}
            href={`/admin/orders${tab.val === "all" ? "" : `?status=${tab.val}`}`}
            className={`px-3.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
              (!status && tab.val === "all") || status === tab.val
                ? "bg-amber-500 text-slate-950 font-bold border-amber-500"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orderList.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-black text-white">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDateTime(order.created_at)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-4">
                  <span>Customer: <strong className="text-white">{order.customer_name}</strong></span>
                  <span>Email: {order.customer_email}</span>
                  <span>Phone: {order.customer_phone}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-medium">Status:</span>
                <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
              </div>
            </div>

            {/* Grid of Items & Delivery info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Items List (8 cols) */}
              <div className="lg:col-span-8 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <span className="font-bold text-slate-300 uppercase tracking-wider block">
                  Material Cutting Specs &amp; Line Items
                </span>
                <div className="divide-y divide-slate-800">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white block">{item.product_name}</span>
                        {item.custom_specs && (
                          <div className="text-slate-400 flex flex-wrap gap-x-3 mt-0.5">
                            {item.custom_specs.length_metres && (
                              <span className="text-amber-400 font-medium">
                                Cut length: {item.custom_specs.length_metres}m
                              </span>
                            )}
                            {item.custom_specs.gauge && <span>Gauge: {item.custom_specs.gauge}</span>}
                            {item.custom_specs.colour && <span>Colour: {item.custom_specs.colour}</span>}
                            {item.custom_specs.special_instructions && (
                              <span className="italic block w-full text-slate-500">
                                Notes: &ldquo;{item.custom_specs.special_instructions}&rdquo;
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-slate-500">
                          {item.quantity} units @ {formatCurrency(item.unit_price)}
                        </span>
                      </div>
                      <span className="font-bold text-white">
                        {formatCurrency(item.line_total)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-slate-400">Total Payable:</span>
                  <span className="text-amber-500 text-base">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Delivery Destination (4 cols) */}
              <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Site Delivery Address</span>
                </span>
                <p className="text-slate-200 font-medium">{order.delivery_address?.recipient_name}</p>
                <p className="text-slate-400">{order.delivery_address?.street_address}</p>
                <p className="text-slate-400">
                  {order.delivery_address?.city}, {order.delivery_address?.state}
                </p>
                <p className="text-slate-400 pt-1">Tel: {order.delivery_address?.phone}</p>
                {order.delivery_address?.additional_instructions && (
                  <p className="text-amber-400/90 italic pt-1 border-t border-slate-800">
                    Dispatch Note: &ldquo;{order.delivery_address?.additional_instructions}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {orderList.length === 0 && (
          <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 text-slate-400 text-sm">
            No orders match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

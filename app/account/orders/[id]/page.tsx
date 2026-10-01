import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Ruler,
  Building,
} from "lucide-react";
import { OrderStatus } from "@/types/database";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Order Details | Roofing Construction Shop",
};

const ORDER_STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: "pending", label: "Order Placed" },
  { key: "paid", label: "Payment Confirmed" },
  { key: "processing", label: "In Production / Shearing" },
  { key: "ready_for_delivery", label: "Ready for Dispatch" },
  { key: "shipped", label: "Out for Delivery" },
  { key: "completed", label: "Delivered & Cleared" },
];

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?redirect=/account/orders/${id}`);
  }

  const adminDb = createAdminClient();
  const { data: order, error } = await adminDb
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Ensure customer can only view their own order unless they are an admin
  if (order.profile_id && order.profile_id !== session.id && session.role !== "admin") {
    redirect("/account/orders");
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              Order Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              #{order.order_number}
            </h1>
          </div>
          <div className="text-sm text-slate-400">
            Placed on {formatDateTime(order.created_at)}
          </div>
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          Dispatch &amp; Production Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="space-y-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted
                      ? "bg-amber-500"
                      : "bg-slate-800"
                  }`}
                />
                <span
                  className={`text-xs block font-medium leading-tight ${
                    isCurrent
                      ? "text-amber-400 font-bold"
                      : isCompleted
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Order Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white">Manufactured Items &amp; Sheets</h2>

          <div className="divide-y divide-slate-800">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="py-4 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {item.product_name}
                  </h3>
                  {item.custom_specs && (
                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                      {item.custom_specs.length_metres && (
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Ruler className="w-3 h-3 text-amber-500" />
                          Length: {item.custom_specs.length_metres}m
                        </span>
                      )}
                      {item.custom_specs.gauge && <span>Gauge: {item.custom_specs.gauge}</span>}
                      {item.custom_specs.colour && <span>Colour: {item.custom_specs.colour}</span>}
                      {item.custom_specs.special_instructions && (
                        <span className="italic block w-full mt-1">
                          Instructions: &ldquo;{item.custom_specs.special_instructions}&rdquo;
                        </span>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-slate-400 block pt-1">
                    {item.quantity} unit(s) @ {formatCurrency(item.unit_price)}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-white text-sm sm:text-base block">
                    {formatCurrency(item.line_total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Site Delivery Fee:</span>
              <span className="text-white font-medium">{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-white text-base">
              <span>Total Amount:</span>
              <span className="text-2xl font-black text-amber-500">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Site Delivery Address */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Project Delivery Site</span>
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-bold text-white">{order.delivery_address.recipient_name}</p>
              <p>{order.delivery_address.street_address}</p>
              <p>
                {order.delivery_address.city}, {order.delivery_address.state}
              </p>
              <p className="text-slate-400 pt-1">Phone: {order.delivery_address.phone}</p>
              {order.delivery_address.additional_instructions && (
                <p className="text-slate-400 italic pt-1 border-t border-slate-800">
                  Note: &ldquo;{order.delivery_address.additional_instructions}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Payment Status Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-500" />
              <span>Payment Details</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-white capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold text-amber-400 capitalize">
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

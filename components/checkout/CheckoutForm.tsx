"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutCustomerSchema, CheckoutCustomerFormData } from "@/lib/validation/checkout";
import { createOrderAction } from "@/lib/orders/actions";
import { useCartStore } from "@/lib/cart/store";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  AlertCircle,
  Truck,
  CreditCard,
  Building,
  CheckCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";

export function CheckoutForm() {
  const router = useRouter();
  const isHydrated = useCartStore((state) => state.isHydrated);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [serverError, setServerError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutCustomerFormData>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      paymentMethod: "bank_transfer",
    },
  });

  // Prepopulate if logged in
  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          if (user.email) setValue("email", user.email);

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            if (profile.full_name) setValue("fullName", profile.full_name);
            if (profile.phone) setValue("phone", profile.phone);
          }
        }
      } catch (err) {
        console.error("Error checking user for checkout:", err);
      }
    }
    checkUser();
  }, [setValue]);

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <span>Loading checkout details...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-sm text-slate-400">Please add materials before checking out.</p>
        <Link
          href="/products"
          className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 500000 ? 0 : 15000;
  const totalAmount = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutCustomerFormData) => {
    setServerError(null);

    // Format payload for Server Action
    const payload = {
      customer: data,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
        customSpecs: i.customSpecs || null,
      })),
    };

    const result = await createOrderAction(payload);

    if (result.success && result.orderNumber) {
      clearCart();
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber)}&orderId=${encodeURIComponent(
          result.orderId || ""
        )}`
      );
    } else {
      setServerError(result.error || "Failed to process order. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Customer & Delivery Form (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        {!isAuthenticated && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs text-slate-300">
                <span>Already have a company or contractor account?</span>
              </div>
            </div>
            <Link
              href="/login?redirect=/checkout"
              className="text-xs font-bold text-amber-400 hover:underline shrink-0"
            >
              Sign In with Google
            </Link>
          </div>
        )}

        {serverError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Checkout Error</strong>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>1. Contact & Invoicing Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name / Registered Company Name *
              </label>
              <input
                {...register("fullName")}
                placeholder="e.g. Babatunde Construction Ltd"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              {errors.fullName && (
                <p className="text-red-400 text-[11px] mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address (For Invoices & Tracking) *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="billing@company.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              {errors.email && (
                <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Site Contact Phone / WhatsApp *
              </label>
              <input
                {...register("phone")}
                placeholder="+234 803 123 4567"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              {errors.phone && (
                <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Site Delivery Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span>2. Project Site Delivery Address</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Street Address / Site Location *
              </label>
              <input
                {...register("streetAddress")}
                placeholder="Plot 45, Beside Central Mosque, Off Express Road"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              {errors.streetAddress && (
                <p className="text-red-400 text-[11px] mt-1">{errors.streetAddress.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">City / Town *</label>
                <input
                  {...register("city")}
                  placeholder="Ikeja"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                {errors.city && (
                  <p className="text-red-400 text-[11px] mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">State *</label>
                <input
                  {...register("state")}
                  placeholder="Lagos State"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                {errors.state && (
                  <p className="text-red-400 text-[11px] mt-1">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Site Offloading & Dispatch Instructions (Optional)
              </label>
              <textarea
                rows={2}
                {...register("additionalInstructions")}
                placeholder="Crane access available, deliver between 8am-12pm, call site foreman upon departure..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Architecture Option */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <span>3. Payment Method</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 cursor-pointer">
              <input
                type="radio"
                value="bank_transfer"
                {...register("paymentMethod")}
                className="mt-1 text-amber-500 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-bold text-white block text-sm">
                  Official Corporate Bank Transfer (Recommended)
                </span>
                <span className="text-slate-400">
                  Instant invoice generated with our corporate bank account. Preferred for building
                  materials and commercial contractor accounting.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                value="pay_on_delivery"
                {...register("paymentMethod")}
                className="mt-1 text-amber-500 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-bold text-white block text-sm">
                  Payment on Site Delivery (Subject to Verification)
                </span>
                <span className="text-slate-400">
                  Inspect bundle gauges with our driver before final bank transfer clearance.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Order Summary & Submit (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28">
        <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
          Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
        </h3>

        {/* Itemized Mini List */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.cartItemId} className="flex justify-between items-start text-xs text-slate-300">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">{i.productName}</span>
                <span className="text-slate-400 text-[11px]">
                  {i.quantity} × {i.unit}
                  {i.customSpecs?.length_metres ? ` @ ${i.customSpecs.length_metres}m` : ""}
                </span>
              </div>
              <span className="font-semibold text-white">{formatCurrency(i.lineTotal)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal:</span>
            <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Site Delivery Fee:</span>
            <span className="font-semibold text-white">
              {deliveryFee === 0 ? (
                <span className="text-emerald-400">FREE</span>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="font-bold text-white text-base">Total Payable:</span>
            <span className="text-2xl font-black text-amber-500">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Server validates real-time prices &amp; inventory before order dispatch.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Validating &amp; Creating Order...</span>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Complete Order &amp; Generate Invoice</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useCartStore } from "@/lib/cart/store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ArrowLeft, Ruler } from "lucide-react";

export function CartView() {
  const isHydrated = useCartStore((state) => state.isHydrated);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <span>Loading your shopping cart...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-400">
          You haven&apos;t added any roofing sheets, shingles, or accessories yet.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow-md shadow-amber-500/10"
          >
            <span>Explore Materials Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 500000 ? 0 : 15000;
  const estimatedTotal = subtotal + deliveryFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Item Details & Specifications
          </span>
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info & Thumbnail */}
              <div className="flex items-start gap-4 flex-1">
                <div className="relative w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  <Image
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>

                  {/* Specifications & Variants */}
                  <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                    {item.variantName && (
                      <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
                        {item.variantName}
                      </span>
                    )}
                    {item.customSpecs?.length_metres && (
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <Ruler className="w-3 h-3 text-amber-500" />
                        Length: {item.customSpecs.length_metres}m per sheet
                      </span>
                    )}
                    {item.customSpecs?.special_instructions && (
                      <span className="text-slate-400 italic">
                        Note: &ldquo;{item.customSpecs.special_instructions}&rdquo;
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 pt-1">
                    Rate: <span className="text-white font-semibold">{formatCurrency(item.effectiveUnitPrice)}</span> / {item.unit}
                    {item.productType === "dimensioned" && item.customSpecs?.length_metres && (
                      <span className="text-slate-400 ml-1">
                        ({formatCurrency(item.effectiveUnitPrice * item.customSpecs.length_metres)} / sheet)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                {/* Quantity Box */}
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-white text-xs">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[100px]">
                  <span className="text-sm font-extrabold text-amber-500 block">
                    {formatCurrency(item.lineTotal)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {item.quantity} {item.unit}{item.quantity > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping for Materials</span>
          </Link>
        </div>
      </div>

      {/* Order Summary (4 cols) */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 sticky top-28">
        <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Items Subtotal:</span>
            <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Estimated Site Delivery:</span>
            <span className="font-semibold text-white">
              {deliveryFee === 0 ? (
                <span className="text-emerald-400">FREE (Orders &gt; ₦500k)</span>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="font-bold text-white">Total Amount:</span>
            <span className="text-2xl font-black text-amber-500">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          Prices and factory inventory will be authoritatively validated on the server during
          checkout.
        </div>

        <Link
          href="/checkout"
          className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
        >
          <span>Proceed to Secure Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

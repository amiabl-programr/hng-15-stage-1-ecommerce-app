"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/types/database";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Check, Calculator, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

interface ProductConfiguratorProps {
  product: Product;
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Dimensioned sheet length state (in metres)
  const [lengthMetres, setLengthMetres] = useState<number>(3.0);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Effective unit price based on variant override or base product price
  const effectiveUnitPrice = selectedVariant?.price_override != null
    ? Number(selectedVariant.price_override)
    : Number(product.base_price);

  // Line total calculation
  const isDimensioned = product.product_type === "dimensioned";
  const singleItemPrice = isDimensioned
    ? effectiveUnitPrice * (lengthMetres || 1)
    : effectiveUnitPrice;
  const totalPrice = singleItemPrice * quantity;

  const handleAddToCart = () => {
    const primaryImg = product.images?.[0]?.image_url;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.product_type,
      unit: product.unit,
      basePrice: Number(product.base_price),
      effectiveUnitPrice,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantAttributes: selectedVariant?.attributes,
      customSpecs: isDimensioned
        ? {
            length_metres: lengthMetres,
            gauge: (selectedVariant?.attributes?.thickness as string) || "Standard",
            colour: (selectedVariant?.attributes?.colour as string) || "Standard",
            special_instructions: specialInstructions || undefined,
          }
        : specialInstructions
        ? { special_instructions: specialInstructions }
        : undefined,
      quantity,
      imageUrl: primaryImg,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
      {/* Price Header */}
      <div>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
          {isDimensioned ? "Price per Linear Metre" : "Unit Price"}
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-white">
            {formatCurrency(effectiveUnitPrice)}
          </span>
          <span className="text-slate-400 text-sm font-medium">/{product.unit}</span>
        </div>
      </div>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="text-sm font-semibold text-slate-200 block">
            Select Specification / Gauge / Colour:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <span className="font-bold text-sm">{v.name}</span>
                  <div className="flex justify-between items-center mt-2 text-slate-400">
                    <span>SKU: {v.sku}</span>
                    <span className="font-semibold text-amber-400">
                      {formatCurrency(v.price_override ?? product.base_price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dimensioned Roofing Sheet Calculator */}
      {isDimensioned && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <span>Custom Sheet Length Specification</span>
          </div>
          <p className="text-xs text-slate-400">
            Specify the cut-to-length dimension in metres for continuous roll forming without end laps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Length per sheet (Metres):
              </label>
              <input
                type="number"
                min="0.5"
                max="30"
                step="0.1"
                value={lengthMetres}
                onChange={(e) => setLengthMetres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard: 2.0m - 12.0m (custom up to 30m)
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Number of Sheets:
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              {product.min_order_quantity > 1 && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Min. order: {product.min_order_quantity} sheets
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>Single Sheet Subtotal ({lengthMetres}m @ {formatCurrency(effectiveUnitPrice)}/m):</span>
              <span className="font-semibold text-white">{formatCurrency(singleItemPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-amber-400 pt-1 border-t border-slate-800">
              <span>Total Linear Metres:</span>
              <span>{(lengthMetres * quantity).toFixed(1)} metres</span>
            </div>
          </div>
        </div>
      )}

      {/* Standard Product Quantity */}
      {!isDimensioned && (
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Quantity ({product.unit}s):
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            {product.min_order_quantity > 1 && (
              <span className="text-xs text-slate-400">
                Minimum order: {product.min_order_quantity} {product.unit}s
              </span>
            )}
          </div>
        </div>
      )}

      {/* Special Technical Instructions / Notes */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Bending / Cutting Instructions (Optional):
        </label>
        <textarea
          rows={2}
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="e.g. Ridge angle at 22 degrees, punch holes on left flange..."
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
        />
      </div>

      {/* Calculated Total & Cart Button */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400 font-medium">Estimated Configuration Total:</span>
          <span className="text-2xl font-black text-amber-500">{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              added
                ? "bg-emerald-500 text-slate-950"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Shopping Cart</span>
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="py-3.5 px-5 rounded-lg font-semibold text-sm bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

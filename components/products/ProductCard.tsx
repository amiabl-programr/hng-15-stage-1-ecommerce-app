"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/cart/store";
import { pickPrimaryImage } from "@/lib/products/image-manifest";
import { ProductImageFrame } from "@/components/products/ProductImageFrame";
import { Star, ShoppingBag, Ruler, Eye, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  product,
  discountPercent,
  rating = 5,
  reviewCount = 6,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const primaryImage = pickPrimaryImage(product.images);

  // Calculate strike-through original price if discount is present
  const originalPrice = discountPercent
    ? product.base_price * (1 + discountPercent / 100)
    : null;

  const isDimensioned = product.product_type === "dimensioned";

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const primaryVariant = product.variants?.[0];
    const effectiveUnitPrice =
      primaryVariant?.price_override != null
        ? Number(primaryVariant.price_override)
        : Number(product.base_price);

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.product_type,
      unit: product.unit,
      basePrice: Number(product.base_price),
      effectiveUnitPrice,
      variantId: primaryVariant?.id,
      variantName: primaryVariant?.name,
      variantAttributes: primaryVariant?.attributes,
      quantity: 1, // Exactly 1 item for items that can be bought individually
      imageUrl: primaryImage?.image_url,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card-shadow group bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-blue-500 flex flex-col justify-between">
      {/* 1. Image Container with Badges */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
          <ProductImageFrame
            slug={product.slug}
            alt={product.name}
            image={primaryImage}
            imageClassName="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent ? (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              -{discountPercent}%
            </span>
          ) : product.is_featured ? (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              HOT
            </span>
          ) : (
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              IN STOCK
            </span>
          )}

          {product.product_type === "dimensioned" && (
            <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs uppercase">
              <Ruler className="w-2.5 h-2.5 text-blue-400" />
              Custom Cut
            </span>
          )}
        </div>

        {/* Hover Quick Action (slides in from right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <Link
            href={`/products/${product.slug}`}
            className="card-action w-8 h-8 rounded-full bg-white text-slate-700 hover:text-blue-600 shadow-md flex items-center justify-center"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Product Meta & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate mb-1">
            {product.category?.name || "Architectural Roofing"}
          </p>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-slate-800 text-sm hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & CTA Button */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-black text-blue-600 tracking-tight">
              {formatCurrency(product.base_price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-semibold">
              /{product.unit}
            </span>
          </div>

          {isDimensioned ? (
            <Link
              href={`/products/${product.slug}`}
              className="btn-press w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Configure Cuts</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleQuickAddToCart}
              className={`btn-press w-full font-extrabold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/products/ProductCard";
import { formatCurrency } from "@/lib/utils";
import {
  LayoutGrid,
  List,
  Star,
  ShoppingBag,
  Ruler,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface CatalogViewSwitcherProps {
  products: Product[];
  totalCount: number;
}

export function CatalogViewSwitcher({ products, totalCount }: CatalogViewSwitcherProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Local sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.base_price - b.base_price;
    if (sortBy === "price-desc") return b.base_price - a.base_price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0; // relevance
  });

  return (
    <div className="space-y-6">
      {/* View & Sort Control Bar (Matching Images 2 & 4) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: View Mode Toggle & Total Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            There are <strong className="text-slate-900 font-extrabold">{totalCount}</strong> products
          </span>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Display: Grid View vs List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              discountPercent={idx === 1 ? 15 : idx === 4 ? 20 : undefined}
              rating={5}
              reviewCount={10 + idx * 2}
            />
          ))}
        </div>
      ) : (
        /* List View (Matching Reference Image 2) */
        <div className="space-y-4">
          {sortedProducts.map((product, idx) => {
            const primaryImage =
              product.images?.find((img) => img.is_primary)?.image_url ||
              product.images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={product.id}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start"
              >
                {/* Product Thumbnail */}
                <div className="relative aspect-square w-40 sm:w-48 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-3 border border-slate-100">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 200px"
                    className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                  {idx === 1 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      -15%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {product.category?.name || "Architectural Roofing"}
                  </span>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-slate-400 font-medium ml-1">
                      ({12 + idx * 3})
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.short_description || product.description}
                  </p>

                  {/* Stock Status */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-600 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Availability: 120+ In Stock</span>
                  </div>
                </div>

                {/* Price and CTA Button */}
                <div className="sm:border-l sm:border-slate-100 sm:pl-6 flex flex-col items-center sm:items-end justify-center shrink-0 w-full sm:w-auto space-y-3 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                  <div className="text-center sm:text-right">
                    <span className="text-lg font-black text-blue-600 tracking-tight block">
                      {formatCurrency(product.base_price)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      per {product.unit}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {product.product_type === "dimensioned" ? (
                      <>
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Configure Cuts</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

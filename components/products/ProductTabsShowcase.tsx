"use client";

import { useState } from "react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductTabsShowcaseProps {
  products: Product[];
}

export function ProductTabsShowcase({ products }: ProductTabsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"featured" | "popular" | "bestseller">("featured");

  // Tab filtering logic
  const getFilteredProducts = () => {
    switch (activeTab) {
      case "popular":
        // Show dimensioned roofing sheets first
        return [...products].sort((a, b) =>
          a.product_type === "dimensioned" ? -1 : 1
        );
      case "bestseller":
        // Show highest price or key materials first
        return [...products].sort((a, b) => b.base_price - a.base_price);
      case "featured":
      default:
        return products.filter((p) => p.is_featured).length > 0
          ? products.filter((p) => p.is_featured)
          : products;
    }
  };

  const displayedProducts = getFilteredProducts().slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            Top Quality Materials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Latest Products
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === "featured"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === "popular"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("bestseller")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === "bestseller"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Best Sellers
          </button>
        </div>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            discountPercent={idx === 1 ? 15 : idx === 3 ? 10 : undefined}
            rating={5}
            reviewCount={8 + (idx * 3)}
          />
        ))}
      </div>
    </div>
  );
}

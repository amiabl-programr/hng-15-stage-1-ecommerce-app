import { getAllProducts, getCategories } from "@/lib/products/queries";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, PackageX } from "lucide-react";

export const metadata = {
  title: "Roofing Materials & Sheet Catalog | Roofing Construction Shop",
  description:
    "Explore our complete inventory of longspan sheets, step tiles, metcopo, shingles, trimmers, ridge caps, and custom metal fabrication.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    type?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, type, sort } = await searchParams;

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getAllProducts(category),
  ]);

  // Client / SSR filtering
  let filteredProducts = [...allProducts];

  if (search) {
    const q = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q)
    );
  }

  if (type && type !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.product_type === type);
  }

  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.base_price - b.base_price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.base_price - a.base_price);
  } else if (sort === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Engineered Inventory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Roofing Materials & Fabrication Catalogue
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Order pre-cut standard products or enter custom dimensions for continuous roll-formed
          aluminium and steel sheets.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 mb-10 space-y-4">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by profile name, gauge, alloy..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              name="category"
              defaultValue={category || ""}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Type Dropdown */}
          <div className="sm:col-span-2">
            <select
              name="type"
              defaultValue={type || "all"}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Types</option>
              <option value="dimensioned">Custom Length</option>
              <option value="standard">Standard Products</option>
              <option value="service">Services</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-2">
            <select
              name="sort"
              defaultValue={sort || "featured"}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          <div className="sm:col-span-12 flex justify-end gap-2 pt-2">
            {(category || search || (type && type !== "all") || (sort && sort !== "featured")) && (
              <Link
                href="/products"
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Clear Filters
              </Link>
            )}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Category Quick Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs">
        <Link
          href="/products"
          className={`px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
            !category
              ? "bg-amber-500 text-slate-950 font-bold border-amber-500"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
          }`}
        >
          All Items ({allProducts.length})
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
              category === c.slug
                ? "bg-amber-500 text-slate-950 font-bold border-amber-500"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Roofing Materials Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            No items matched your current filter criteria. Try adjusting your search query or reset
            the filters.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

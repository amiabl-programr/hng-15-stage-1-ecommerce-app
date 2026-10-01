import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getCategories } from "@/lib/products/queries";
import { CatalogViewSwitcher } from "@/components/products/CatalogViewSwitcher";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Shop Catalogue | Architectural Roofing Sheets & Coil Fabrication",
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

  // Server-side filtering
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

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Shop Top Header & Breadcrumbs (Image 2/4 Style) */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">Shop</span>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-blue-600 capitalize">
                  {category.replace(/-/g, " ")}
                </span>
              </>
            )}
          </nav>

          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Shop Materials & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Direct mill inventory of high-tensile aluzinc coils, marine-grade aluminium sheets, stone-coated luxury shingles, and CNC press-bent ridge accessories.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Subcategories Visual Cards Row (Image 2/4 Top Tiles) */}
        <section className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Subcategories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => {
              const isSelected = category === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={isSelected ? "/products" : `/products?category=${cat.slug}`}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 group ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                      : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={cat.image_url || "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=200&q=80"}
                      alt={cat.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Main Grid: Filter Sidebar + Products (Grid & List View) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar (3 cols) */}
          <aside className="lg:col-span-3 space-y-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filter By</span>
              </h3>
              {(category || search) && (
                <Link
                  href="/products"
                  className="text-[11px] font-bold text-red-600 hover:underline"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Filter Group: Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Categories
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  href="/products"
                  className={`flex items-center justify-between py-1 transition-colors ${
                    !category ? "text-blue-600 font-extrabold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>All Profiles</span>
                  <span className="text-[10px] text-slate-400">({allProducts.length})</span>
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    className={`flex items-center justify-between py-1 transition-colors ${
                      category === c.slug
                        ? "text-blue-600 font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400">
                      ({allProducts.filter((p) => p.category_id === c.id).length})
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Filter Group: Availability */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Availability
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>In Stock (Factory Depots)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Custom On-Site Cut</span>
                </label>
              </div>
            </div>

            {/* Filter Group: Thickness / Gauge */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Thickness / Gauge
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["0.45mm", "0.50mm", "0.55mm", "0.65mm"].map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-center font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Filter Group: Color Swatches (Image 2/4 Style) */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Coil Color
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { name: "Charcoal Black", color: "#1e293b" },
                  { name: "Wine Red", color: "#881337" },
                  { name: "Traffic Blue", color: "#1d4ed8" },
                  { name: "Forest Green", color: "#14532d" },
                  { name: "Slate Grey", color: "#64748b" },
                  { name: "Coffee Brown", color: "#451a03" },
                ].map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-slate-200 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            {/* Filter Group: Material */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Material
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span>Aluminium Alloy 3003</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span>Galvalume / Aluzinc Steel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span>Stone-Coated Basalt</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid & List View (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            <CatalogViewSwitcher
              products={filteredProducts}
              totalCount={filteredProducts.length}
            />
          </main>
        </div>

        {/* 4. Bottom Rich Architectural & Material Guide (Images 2 & 4 Bottom) */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
                Technical Specifications & Standards
              </span>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Architectural Standards for Tropical Roofing Resilience
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                With durable materials such as 3003-H16 high-grade aluminium and zinc-alloy coated steel, our roofing sheets offer superior structural tensile strength and long-lasting performance against coastal humidity, industrial acid rain, and equatorial solar degradation.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Zero End-Lap Seams:</strong> Continuous mobile extrusion eliminates horizontal lap joints that cause storm water ingress.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Heavy Gauge Verification:</strong> Micrometer verified thicknesses from 0.45mm up to 0.65mm ensure zero wind flutter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Fluorocarbon (PVDF) Resin:</strong> Tested for 25+ years anti-chalking and ultraviolet fade resistance.</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
                  alt="Metcopo Installation"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                  alt="Roll Forming Precision"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

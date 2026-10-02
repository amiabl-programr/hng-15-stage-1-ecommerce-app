import Link from "next/link";
import { getCategories } from "@/lib/products/queries";
import { CategoryImageFrame } from "@/components/products/ProductImageFrame";
import { ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "Roofing Categories & Profiles | Roofing Construction Shop",
  description:
    "Explore our complete range of roofing sheet categories, architectural shingles, ridge caps, and custom metal fabrication services.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Product Lineup
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Roofing Categories & Profiles
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Browse by material family or specialized service to view specifications, gauge options,
          and cut-to-length pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
              <CategoryImageFrame
                slug={category.slug}
                alt={category.name}
                url={category.image_url}
                imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-75" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {category.name}
                </h2>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-500">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

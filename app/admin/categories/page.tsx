import { createAdminClient } from "@/lib/supabase/admin";
import { CategoryCreateForm } from "@/components/admin/CategoryCreateForm";
import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";

export const metadata = {
  title: "Categories Management | Admin Portal",
};

export default async function AdminCategoriesPage() {
  const adminDb = createAdminClient();

  const { data: categories } = await adminDb
    .from("categories")
    .select(`
      *,
      products:products(count)
    `)
    .order("display_order", { ascending: true });

  const categoryList = categories || [];

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Taxonomy &amp; Organization
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Categories Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          Organize roofing profiles, shingles, fasteners, and services into structured storefront collections.
        </p>
      </div>

      {/* Creation Form */}
      <CategoryCreateForm />

      {/* Categories Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Active Categories ({categoryList.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Slug</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categoryList.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                        {cat.image_url ? (
                          <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <Layers className="w-5 h-5 text-slate-600 m-auto" />
                        )}
                      </div>
                      <span className="font-bold text-white text-sm">{cat.name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-slate-400">{cat.slug}</td>

                  <td className="py-4 px-6 text-slate-300 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>

                  <td className="py-4 px-6 font-semibold text-white">
                    {cat.products?.[0]?.count || 0} items
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

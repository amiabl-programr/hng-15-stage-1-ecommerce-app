import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Ruler, Box, Wrench, Layers } from "lucide-react";

export const metadata = {
  title: "Product Inventory | Admin Portal",
};

export default async function AdminProductsPage() {
  const adminDb = createAdminClient();

  const { data: products } = await adminDb
    .from("products")
    .select(`
      *,
      category:categories(name),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .order("created_at", { ascending: false });

  const productList = products || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Catalogue Management
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Products &amp; Sheets</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage physical materials, dimensioned sheet profiles, and fabrication services.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/10 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Base Price</th>
                <th className="py-3 px-6">Variants</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {productList.map((prod) => {
                const primaryImage =
                  prod.images?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=200&q=80";

                return (
                  <tr key={prod.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <Image
                            src={primaryImage}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{prod.name}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{prod.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-300">
                      {prod.category?.name || "Uncategorized"}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold capitalize bg-slate-800 text-slate-300">
                        {prod.product_type === "dimensioned" && <Ruler className="w-3 h-3 text-amber-500" />}
                        {prod.product_type === "service" && <Wrench className="w-3 h-3 text-blue-400" />}
                        {prod.product_type === "standard" && <Box className="w-3 h-3 text-slate-400" />}
                        <span>{prod.product_type}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-white">
                      {formatCurrency(prod.base_price)} / {prod.unit}
                    </td>

                    <td className="py-4 px-6 text-slate-300">
                      {prod.variants?.length || 0} variant(s)
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {prod.is_active ? "Active" : "Archived"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-amber-400 hover:underline"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {productList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

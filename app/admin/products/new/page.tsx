import { createAdminClient } from "@/lib/supabase/admin";
import { ProductCreateForm } from "@/components/admin/ProductCreateForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Add New Product | Admin Portal",
};

export default async function NewProductPage() {
  const adminDb = createAdminClient();
  const { data: categories } = await adminDb
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
          Inventory Expansion
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Add New Roofing Material / Service</h1>
      </div>

      <ProductCreateForm categories={categories || []} />
    </div>
  );
}

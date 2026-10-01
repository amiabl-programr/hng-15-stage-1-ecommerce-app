import { createAdminClient } from "@/lib/supabase/admin";
import { StockAdjuster } from "@/components/admin/StockAdjuster";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Package } from "lucide-react";

export const metadata = {
  title: "Inventory & Stock Levels | Admin Portal",
};

export default async function AdminInventoryPage() {
  const adminDb = createAdminClient();

  const { data: variants } = await adminDb
    .from("product_variants")
    .select(`
      *,
      product:products(name, unit, base_price, category:categories(name))
    `)
    .order("stock_quantity", { ascending: true });

  const variantList = variants || [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Stock Control
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Inventory Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor raw coil meters, packaged bundles, and update stock directly without code changes.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Product / Specification</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6">Current Quantity</th>
                <th className="py-3 px-6">Adjust Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {variantList.map((v: any) => {
                const isLow = v.stock_quantity <= 200;
                const isOut = v.stock_quantity === 0;

                return (
                  <tr key={v.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block text-sm">
                        {v.product?.name}
                      </span>
                      <span className="text-amber-400 text-[11px] block">{v.name}</span>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-300 font-semibold">{v.sku}</td>

                    <td className="py-4 px-6 text-slate-400">
                      {v.product?.category?.name || "Materials"}
                    </td>

                    <td className="py-4 px-6">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Optimal
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-white text-sm">
                      {v.stock_quantity.toLocaleString()} {v.product?.unit || "units"}
                    </td>

                    <td className="py-4 px-6">
                      <StockAdjuster variantId={v.id} currentStock={v.stock_quantity} />
                    </td>
                  </tr>
                );
              })}

              {variantList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No product variants configured in inventory yet.
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

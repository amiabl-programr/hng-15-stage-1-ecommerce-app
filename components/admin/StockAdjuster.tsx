"use client";

import { useState } from "react";
import { updateStockAction } from "@/lib/admin/actions";
import { Check, Loader2 } from "lucide-react";

interface StockAdjusterProps {
  variantId: string;
  currentStock: number;
}

export function StockAdjuster({ variantId, currentStock }: StockAdjusterProps) {
  const [stock, setStock] = useState<number>(currentStock);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (stock === currentStock) return;
    setLoading(true);
    setSaved(false);

    const res = await updateStockAction(variantId, stock);
    setLoading(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Failed to update stock: " + res.error);
      setStock(currentStock);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
      />
      {stock !== currentStock && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
        </button>
      )}
      {saved && <Check className="w-4 h-4 text-emerald-400" />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { OrderStatus } from "@/types/database";
import { updateOrderStatusAction } from "@/lib/admin/actions";
import { Loader2, Check } from "lucide-react";

interface OrderStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "In Production / Shearing" },
  { value: "ready_for_delivery", label: "Ready for Dispatch" },
  { value: "shipped", label: "Out for Delivery" },
  { value: "completed", label: "Delivered & Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusDropdown({ orderId, currentStatus }: OrderStatusDropdownProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus);
    setUpdating(true);
    setSaved(false);

    const res = await updateOrderStatusAction(orderId, newStatus);
    setUpdating(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Failed to update status: " + res.error);
      setStatus(currentStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={updating}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 capitalize cursor-pointer disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {updating && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
      {saved && <Check className="w-3.5 h-3.5 text-emerald-400" />}
    </div>
  );
}

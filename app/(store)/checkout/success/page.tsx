import Link from "next/link";
import { CheckCircle2, Building, Mail, Phone, ArrowRight, FileText } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    orderId?: string;
  }>;
}

export const metadata = {
  title: "Order Confirmed | Roofing Construction Shop",
  description: "Your roofing materials order has been successfully placed.",
};

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber, orderId } = await searchParams;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Thank You For Your Order!
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Your materials request has been registered in our factory production and dispatch queue.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-left space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Order Reference:</span>
              <span className="text-xl font-mono font-bold text-amber-500">
                {orderNumber || "RC-PENDING-REF"}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Payment Pending</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              An itemized confirmation invoice has been sent to your email with our dispatch and
              payment instructions.
            </span>
          </div>
        </div>

        {/* Bank Transfer Instructions */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6 text-left space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Official Corporate Bank Account for Wire Transfer</span>
          </h3>
          <div className="text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-slate-500 block">Bank Name:</span>
              <strong className="text-white text-sm">Zenith Bank Plc</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Account Name:</span>
              <strong className="text-white text-sm">Roofing Construction Shop Ltd</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Account Number:</span>
              <strong className="text-amber-400 font-mono text-base">1012345678</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Transfer Narration / Ref:</span>
              <strong className="text-white font-mono">{orderNumber || "Order Number"}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          {orderId && (
            <Link
              href={`/account/orders/${orderId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Track Order Status</span>
            </Link>
          )}

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/10"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          <span>Questions about delivery? Call our dispatch hotline: +234 800 766 3464</span>
        </div>
      </div>
    </div>
  );
}

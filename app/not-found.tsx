import Link from "next/link";
import { HardHat, ArrowLeft, PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
        <PackageSearch className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Roofing Material or Page Not Found
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          The roofing profile, fabrication spec, or page you requested could not be located. It may
          have been archived or relocated.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Materials</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs border border-slate-700 transition-colors"
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

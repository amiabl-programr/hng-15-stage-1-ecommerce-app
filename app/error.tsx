"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
          Application Notice
        </span>
        <h1 className="text-3xl font-black text-white">Something Went Wrong</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          We experienced an unexpected processing error. Your cart and stored materials remain safe.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Action</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs border border-slate-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

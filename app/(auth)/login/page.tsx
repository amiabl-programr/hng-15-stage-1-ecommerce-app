"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, ArrowRight, HardHat, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginFormContent() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";
  const authError = searchParams.get("error");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign in";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-xl border border-slate-700 sm:px-10">
      {authError && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>Authentication failed. Please verify your Google credentials or try again.</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.39 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>
      </div>

      <div className="mt-8 border-t border-slate-700/60 pt-6">
        <div className="flex items-start gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Authorized administrators configured in <code className="text-amber-400">ADMIN_EMAILS</code> receive automatic dashboard access upon Google authentication.
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
        >
          <span>Back to Storefront</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-7 h-7" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Roofing<span className="text-amber-500">Shop</span>
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-white">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Access your order tracking, custom fabrication specs, and account quotes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-slate-800/90 py-12 text-center text-slate-400 rounded-xl border border-slate-700">
              Loading sign in portal...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}

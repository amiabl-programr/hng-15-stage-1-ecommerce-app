"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/database";
import {
  HardHat,
  ShoppingCart,
  User,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  Wrench,
  Package,
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const isHydrated = useCartStore((state) => state.isHydrated);
  const itemCount = useCartStore((state) => (isHydrated ? state.getItemCount() : 0));

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed fetching navbar user:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight uppercase flex items-center">
                Roofing<span className="text-amber-500">Shop</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase block -mt-1">
                Engineered Materials & Fabrication
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="/products"
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Products & Sheets</span>
            </Link>
            <Link
              href="/categories"
              className="hover:text-amber-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/fabrication"
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Fabrication & Services</span>
            </Link>
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-md hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons: Cart & Auth */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition-colors border border-slate-700/60"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {!loadingUser && (
              <>
                {profile ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors py-1.5 px-3 rounded-lg bg-slate-800/80 border border-slate-700/50"
                    >
                      <User className="w-4 h-4 text-amber-500" />
                      <span className="truncate max-w-[120px]">
                        {profile.full_name || profile.email.split("@")[0]}
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      title="Sign Out"
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg transition-colors shadow-md shadow-amber-500/10"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 rounded-lg bg-slate-800 text-slate-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-bold text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400"
          >
            Products & Sheets
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400"
          >
            Categories
          </Link>
          <Link
            href="/fabrication"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400"
          >
            Fabrication & Services
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-amber-400 font-semibold"
            >
              Admin Dashboard
            </Link>
          )}
          <div className="pt-4 border-t border-slate-800">
            {profile ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-slate-200"
                >
                  My Account ({profile.full_name || profile.email})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-red-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-amber-500 text-slate-950 font-bold py-2 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

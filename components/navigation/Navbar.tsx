"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency } from "@/lib/utils";
import { Profile } from "@/types/database";
import {
  HardHat,
  ShoppingBag,
  User,
  Heart,
  Search,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Wrench,
  Package,
  Layers,
  PhoneCall,
  Clock,
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  const isHydrated = useCartStore((state) => state.isHydrated);
  const itemCount = useCartStore((state) => (isHydrated ? state.getItemCount() : 0));
  const items = useCartStore((state) => state.items);

  // Calculate cart subtotal
  const subtotal = useCartStore((state) => (state.isHydrated ? state.getSubtotal() : 0));

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setProfile(data.user);
          }
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
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setProfile(null);
    window.location.href = "/";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* 1. Top Announcement Bar (Royal Blue) */}
      <div className="bg-blue-600 text-white text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
              Factory Direct
            </span>
            <p className="truncate">
              FREE SITE DELIVERY ON ORDERS OVER ₦500,000 —{" "}
              <Link href="/products" className="underline font-bold hover:text-blue-100 transition-colors">
                SHOP NOW
              </Link>
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6 text-slate-100 text-xs">
            <Link href="/account/orders" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <Link href="/about#contact" className="hover:text-white transition-colors">
              Help Center
            </Link>
            <div className="h-3.5 w-px bg-blue-400/50" />
            <div className="flex items-center gap-1 font-semibold">
              <span>₦ NGN</span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </div>
            <div className="flex items-center gap-1 font-semibold">
              <span>ENGLISH</span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                ROOF<span className="text-blue-600">IX</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                Precision Metal & Roofing
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-slate-700 tracking-wide uppercase">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              Shop
            </Link>

            <Link
              href="/categories"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <span>Categories</span>
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm shadow-xs">
                HOT
              </span>
            </Link>

            <Link
              href="/products"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <span>Products</span>
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm shadow-xs">
                NEW
              </span>
            </Link>

            <Link
              href="/fabrication"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Custom Fabrication</span>
            </Link>

            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>

            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1 font-semibold text-xs tracking-wider"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons: Search, Wishlist, User, Cart */}
          <div className="hidden sm:flex items-center gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            {!loadingUser && (
              <>
                {profile ? (
                  <div className="relative group">
                    <Link
                      href="/account"
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors flex items-center"
                      aria-label="My Account"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                    {/* Hover dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-2 hidden group-hover:block z-50">
                      <div className="px-3 py-2 border-b border-slate-100 text-xs">
                        <p className="font-bold text-slate-800 truncate">{profile.full_name || "Customer"}</p>
                        <p className="text-slate-400 truncate">{profile.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
                      >
                        Dashboard & Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
                      >
                        Order History
                      </Link>
                      {profile.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Operations Portal
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded flex items-center justify-between"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </>
            )}

            {/* Wishlist */}
            <Link
              href="/products"
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </Link>

            {/* Cart Button with Counter and Price Preview */}
            <Link
              href="/cart"
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="text-left text-xs leading-tight hidden xl:block">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total</span>
                <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Small screen mobile controls */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-slate-700"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Inline Search Bar Dropdown */}
      {searchOpen && (
        <div className="border-t border-slate-100 bg-slate-50 py-3 px-4 transition-all">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roofing sheets, shingles, 0.50mm aluminium, ridge caps, bending services..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* 4. Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="pt-2 pb-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roofing materials..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </form>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold hover:text-blue-600 border-b border-slate-100"
          >
            Shop
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between py-2 text-slate-800 font-bold hover:text-blue-600 border-b border-slate-100"
          >
            <span>Categories</span>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              HOT
            </span>
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between py-2 text-slate-800 font-bold hover:text-blue-600 border-b border-slate-100"
          >
            <span>Products</span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              NEW
            </span>
          </Link>
          <Link
            href="/fabrication"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold hover:text-blue-600 border-b border-slate-100"
          >
            Custom Fabrication & Bending
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-slate-800 font-bold hover:text-blue-600 border-b border-slate-100"
          >
            About Us
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-blue-600 font-bold border-b border-slate-100"
            >
              Admin Operations Portal
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200">
            {profile ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-slate-900"
                >
                  My Account ({profile.full_name || profile.email})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-sm"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

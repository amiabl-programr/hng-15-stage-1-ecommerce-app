import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  HardHat,
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  ShoppingBag,
  Users,
  LogOut,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Admin Portal | Roofing Construction Shop",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const isEnvAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

  if (profile?.role !== "admin" && !isEnvAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white uppercase block">
                Admin<span className="text-amber-500">Portal</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                Roofing Operations
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Products &amp; Sheets</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Warehouse className="w-4 h-4 text-amber-500" />
              <span>Inventory &amp; Stock</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Orders &amp; Dispatch</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>Customers</span>
            </Link>
          </nav>
        </div>

        {/* Footer / Storefront link */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 py-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}

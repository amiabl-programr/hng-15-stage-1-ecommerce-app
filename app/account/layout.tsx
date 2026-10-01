import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import Link from "next/link";
import { Package, User, MapPin } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Account Header Navigation */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-8 overflow-x-auto text-sm">
          <Link
            href="/account"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors whitespace-nowrap"
          >
            <User className="w-4 h-4 text-amber-500" />
            <span>Profile Overview</span>
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors whitespace-nowrap"
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>My Orders &amp; Dispatches</span>
          </Link>
        </div>

        {children}
      </div>
      <Footer />
    </div>
  );
}

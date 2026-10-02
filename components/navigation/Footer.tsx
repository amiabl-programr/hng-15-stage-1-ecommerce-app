import Link from "next/link";
import {
  Truck,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">

      {/* 2. Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About Information */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
              About Information
            </h4>
            <div className="text-xs text-slate-500 space-y-2.5 leading-relaxed">
              <p className="font-semibold text-slate-800">Roofix Industrial Materials Ltd.</p>
              <p>Plot 18, Commercial Industrial Estate, Ikeja Expressway, Lagos State, Nigeria.</p>
              <p>
                <span className="font-semibold text-slate-700">Call Us:</span> +234 (0) 800-766-3490
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span> orders@roofixmaterials.com
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Direct factory dispatch to all 36 states</span>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/products?category=roofing-sheets" className="hover:text-blue-600 transition-colors">
                  Longspan Aluminium Sheets
                </Link>
              </li>
              <li>
                <Link href="/products?category=metcopo-roofing" className="hover:text-blue-600 transition-colors">
                  Metcopo Steptile Profiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=shingles" className="hover:text-blue-600 transition-colors">
                  Stone Coated Roofing Shingles
                </Link>
              </li>
              <li>
                <Link href="/products?category=step-tiles" className="hover:text-blue-600 transition-colors">
                  Classic Roman Step Tiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=corrugated-sheets" className="hover:text-blue-600 transition-colors">
                  Corrugated Metal Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=ridge-caps" className="hover:text-blue-600 transition-colors">
                  Ridge Caps, Trimmers & Gutters
                </Link>
              </li>
              <li>
                <Link href="/fabrication" className="hover:text-blue-600 transition-colors">
                  Custom Sheet Bending & Roll Forming
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Your Account */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
              Your Account
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/account/orders" className="hover:text-blue-600 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-blue-600 transition-colors">
                  Account Dashboard
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/fabrication" className="hover:text-blue-600 transition-colors">
                  Request Fabrication Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Company */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
              Our Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Us &amp; Factory Profile
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Quality Standards &amp; Certifications
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Haulage &amp; Delivery Logistics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Contact Customer Engineering
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Payment Icons Strip */}
      <div className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Social Links */}
          <div className="flex items-center gap-4 text-slate-400 font-bold">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">FB</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">X</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">IG</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">IN</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">YT</span>
          </div>

          {/* Copyright */}
          <div>
            Copyright © {new Date().getFullYear()} Roofix Materials Ltd. All Rights Reserved.
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
              VISA
            </span>
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
              MASTERCARD
            </span>
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
              VERVE
            </span>
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
              BANK TRANSFER
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

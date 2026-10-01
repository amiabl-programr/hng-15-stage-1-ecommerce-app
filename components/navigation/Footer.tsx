"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HardHat,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  Check,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      {/* 1. Newsletter Subscription Section (Exact Plumbix Style) */}
      <div className="border-b border-slate-200 bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Subscribe To Our Newsletter
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Subscribe to our technical bulletin to receive factory price updates, architectural coil discounts, and fabrication news.
          </p>

          {subscribed ? (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl inline-flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Thank you for subscribing! We've sent a confirmation to your email.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  Subscribe
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="newsletter-agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="newsletter-agree" className="cursor-pointer">
                  I agree to the terms, conditions, and privacy policy
                </label>
              </div>
            </form>
          )}
        </div>
      </div>

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
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition-colors">
                  Operations Portal (Staff)
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
                  About Us & Factory Profile
                </Link>
              </li>
              <li>
                <Link href="/about#standards" className="hover:text-blue-600 transition-colors">
                  Quality Standards & Certifications
                </Link>
              </li>
              <li>
                <Link href="/about#delivery" className="hover:text-blue-600 transition-colors">
                  Haulage & Delivery Logistics
                </Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-blue-600 transition-colors">
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

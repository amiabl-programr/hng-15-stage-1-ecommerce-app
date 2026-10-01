import Link from "next/link";
import { HardHat, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Certified Heavy Gauge</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Precision micrometer-tested coils ranging from 0.45mm to 0.65mm.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express Site Roll Forming</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Mobile extrusion rigs delivering continuous longspan panels directly on-site.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">25 to 50 Year Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Guaranteed color retention against harsh tropical sun and coastal corrosion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <HardHat className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white uppercase">
                Roofing<span className="text-amber-500">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Industrial and residential architectural roofing solutions, custom corrugated sheet fabrication, and specialized CNC bending services.
            </p>
          </div>

          {/* Product Lines */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Roofing Profiles
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=roofing-sheets" className="hover:text-amber-400 transition-colors">
                  Longspan Aluminium
                </Link>
              </li>
              <li>
                <Link href="/products?category=metcopo-roofing" className="hover:text-amber-400 transition-colors">
                  Metcopo Steptile
                </Link>
              </li>
              <li>
                <Link href="/products?category=shingles" className="hover:text-amber-400 transition-colors">
                  Stone Coated Shingles
                </Link>
              </li>
              <li>
                <Link href="/products?category=step-tiles" className="hover:text-amber-400 transition-colors">
                  Classic Step Tiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=corrugated-sheets" className="hover:text-amber-400 transition-colors">
                  Corrugated Steel Panels
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services & Trimmings
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/fabrication" className="hover:text-amber-400 transition-colors">
                  On-Site Roll Forming
                </Link>
              </li>
              <li>
                <Link href="/fabrication" className="hover:text-amber-400 transition-colors">
                  CNC Sheet Bending & Curving
                </Link>
              </li>
              <li>
                <Link href="/products?category=ridge-caps" className="hover:text-amber-400 transition-colors">
                  Ridge Caps & Flashings
                </Link>
              </li>
              <li>
                <Link href="/products?category=trimmers-and-parapets" className="hover:text-amber-400 transition-colors">
                  Valley Gutters & Parapets
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-amber-400 transition-colors">
                  EPDM Fasteners & Sealants
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact & Depot
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Plot 12 Industrial Layout, Materials Highway, Ikeja / Lekki Corridor</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>+234 800 766 3464</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>dispatch@roofingshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Roofing Construction Shop Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Supply</Link>
            <Link href="/admin" className="hover:text-amber-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

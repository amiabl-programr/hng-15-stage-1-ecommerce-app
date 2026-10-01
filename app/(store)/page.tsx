import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/products/queries";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductTabsShowcase } from "@/components/products/ProductTabsShowcase";
import { CountdownTimer } from "@/components/products/CountdownTimer";
import {
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Play,
  Star,
  BookOpen,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Roofix | Premium Architectural Roofing & Precision Roll-Forming",
  description:
    "Direct factory supplier of Longspan aluminium, Metcopo, Step tiles, Stone-coated shingles, and mobile on-site roll forming services.",
};

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section (Image 5 Style) */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=2000&q=80"
            alt="Architectural Roofing Structure"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Hot Item • Certified Structural Aluminium</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase">
              Premium Quality Stainless &{" "}
              <span className="text-blue-500">Aluminium Roofing</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Direct factory supply of continuous cut-to-length Longspan sheets, Metcopo profiles,
              stone-coated shingles, and mobile on-site roll-forming extrusion. Zero joint leakage.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-blue-600/30"
              >
                Shop Catalogue
              </Link>
              <Link
                href="/fabrication"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg border border-white/20 transition-all backdrop-blur-xs"
              >
                Custom Fabrication
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Three Spotlight Category Banners (Image 5 Top 3 Boxes) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Longspan & Metcopo */}
          <div className="group relative h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80"
              alt="Longspan Aluminium"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                Factory Cut
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mt-1">
                Longspan & Metcopo
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                Continuous profiles up to 30 metres unbroken.
              </p>
              <Link
                href="/products?category=roofing-sheets"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 w-fit px-4 py-2 rounded-md uppercase tracking-wider transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Stone Coated Shingles */}
          <div className="group relative h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
              alt="Stone Coated Shingles"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                Luxury Tile
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mt-1">
                Stone-Coated Shingles
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                Volcanic basalt granule coating with 50-year warranty.
              </p>
              <Link
                href="/products?category=shingles"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 w-fit px-4 py-2 rounded-md uppercase tracking-wider transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Fabrication & Services */}
          <div className="group relative h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
              alt="Bending & Fabrication"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                CNC Press
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mt-1">
                Bending & Roll Forming
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                Custom trims, radius barrel vaults, and on-site extrusion.
              </p>
              <Link
                href="/fabrication"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 w-fit px-4 py-2 rounded-md uppercase tracking-wider transition-colors"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Tabbed Products Showcase (Featured, Popular, Best Sellers) */}
        <section>
          <ProductTabsShowcase products={featuredProducts} />
        </section>

        {/* 4. Precision Workshop & Video Feature Banner (Image 5 Middle) */}
        <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-10 lg:p-16 text-center">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
              alt="Factory roll-forming line"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Play Button Trigger */}
            <div className="w-16 h-16 bg-white/10 hover:bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all hover:scale-110 shadow-lg backdrop-blur-xs">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>

            <span className="text-blue-400 text-xs font-extrabold tracking-widest uppercase block">
              Automated Roll-Forming Rigs
            </span>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              We Provide Precision Extrusion & On-Site Machine Forming
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Our automated mobile extrusion rigs manufacture continuous roofing sheets up to 30 metres directly on your construction site. No transportation transport damage, no joint seams, and zero leak probability.
            </p>

            <div className="pt-2">
              <Link
                href="/fabrication"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg inline-flex items-center gap-2 transition-colors shadow-md shadow-blue-600/20"
              >
                <span>Request Workshop Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Trust Value Propositions Bar (4 Columns with Clean Line Icons) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase">Direct Site Haulage</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Nationwide delivery within 24-48 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase">Factory Direct Pricing</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Save up to 25% buying direct from coil slitters</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase">25-Year Warranty</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Anti-corrosion & UV color retention guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase">24/7 Estimator Support</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant bill of quantities calculation</p>
            </div>
          </div>
        </section>

        {/* 6. Deal of the Week (Image 5 Section with Countdown Timers) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">
                Special Discount
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Deal of the Week!
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:inline">
                Offer Expires In:
              </span>
              <CountdownTimer initialHours={350} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, idx) => (
              <ProductCard
                key={`deal-${product.id}`}
                product={product}
                discountPercent={idx === 0 ? 15 : idx === 1 ? 20 : idx === 2 ? 10 : 25}
                rating={5}
                reviewCount={12 + idx}
              />
            ))}
          </div>
        </section>

        {/* 7. Split Editorial Showcase (Image 5 Two-Column Highlight) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-slate-50 p-8 sm:p-12 rounded-2xl border border-slate-200">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
              alt="Engineered Roofing Project"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
              Professional Solution
            </span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
              Best Architectural Roofing Systems That You Can Trust
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every roof panel supplied by Roofix undergoes rigorous micrometer gauge verification, tensile yield stress testing, and salt-spray resistance audits. We manufacture with Aluzinc-coated steel and marine-grade 3003 aluminium alloys to ensure zero thermal deformation and maximum heat deflection under extreme equatorial sun.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero-joint continuous longspan panels extruded to exact architect dimensions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Anti-fade fluorocarbon coatings tested for 25+ years color fidelity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Complete matching trims, ridge caps, and leak-proof EPDM fasteners</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/about"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Read More Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Testimonial Quote Box (Image 5 Quote Card) */}
        <section className="max-w-3xl mx-auto text-center space-y-4 py-8">
          <div className="flex justify-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <blockquote className="text-base sm:text-lg text-slate-800 font-medium italic leading-relaxed">
            &ldquo;Roofix delivered 180 custom-cut Metcopo panels directly to our commercial estate in Lekki on schedule. The thickness was micrometer-checked and perfectly matched 0.55mm throughout. Zero seam leaks after the heaviest rainfall season.&rdquo;
          </blockquote>

          <div className="pt-2">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              Engr. Babatunde Alabi
            </h4>
            <span className="text-[11px] text-blue-600 font-semibold uppercase">
              Principal Project Consultant, Apex Structural Eng.
            </span>
          </div>
        </section>

        {/* 9. Two Split Promo Discount Banners (Image 5) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                Flat 20% Discount
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">
                0.55mm Corrugated Panels
              </h3>
              <p className="text-xs text-blue-100 mt-2 max-w-sm">
                Industrial strength heavy-gauge sinusoidal steel sheets engineered for warehouses and perimeter walls.
              </p>
            </div>
            <Link
              href="/products?category=corrugated-sheets"
              className="w-fit bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              Shop Now
            </Link>
          </div>

          <div className="p-8 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Factory Clearance
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">
                Ridge Caps & Flashings
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-sm">
                Complete matching finishings for waterproof roof crests, drip edges, and valley trimmers.
              </p>
            </div>
            <Link
              href="/products?category=ridge-caps"
              className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              Shop Now
            </Link>
          </div>
        </section>

        {/* 10. From The Journal / Technical Guides (Image 5) */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
              From The Journal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Roofing Guides & Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                  alt="Roofing Sheet Calculations"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase">
                  Technical Guide • October 2026
                </span>
                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2">
                  How To Calculate Exact Roofing Sheet Coverage & Eliminate Cut Waste
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  A step-by-step quantity surveying guide on measuring rafter pitch, effective width, and linear run requirements.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
                  alt="Aluminium vs Shingles"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase">
                  Material Comparison • October 2026
                </span>
                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2">
                  Aluminium vs. Stone-Coated Shingles: Which Profile Fits Your Roof?
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Analyzing lifespan, acoustic dampening, deadweight load on timber trusses, and tropical sun resilience.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                  alt="Ridge Caps and Flashings"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase">
                  Installation Standard • October 2026
                </span>
                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2">
                  Preventing Ridge Cap Leaks: Flashing & Drip Edge Best Practices
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Why proper lap alignment and EPDM self-drilling fasteners prevent storm uplift and wind-driven water ingress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Manufacturer / Certification Brand Logos (Image 5 Bottom Logos) */}
        <section className="py-6 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">ISO 9001:2015</span>
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">SONCAP APPROVED</span>
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">ALCOA ALLOY</span>
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">NIPPON COATINGS</span>
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">CORUS STEEL</span>
            <span className="text-xs font-black tracking-widest text-slate-700 uppercase">BAOSTEEL COILS</span>
          </div>
        </section>
      </div>
    </div>
  );
}

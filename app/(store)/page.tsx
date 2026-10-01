import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/products/queries";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ShieldCheck,
  Ruler,
  Wrench,
  Truck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Roofing Construction Shop | Industrial Materials & Roll Forming",
  description:
    "Direct factory supplier of Longspan aluminium, Metcopo, Step tiles, Stone-coated shingles, and mobile on-site roll forming services.",
};

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=2000&q=80"
            alt="Roofing Structure Construction Site"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified 0.45mm – 0.65mm Structural Aluminium & Aluzinc</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Architectural Roofing Materials &{" "}
              <span className="text-amber-500">On-Site Roll Forming</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Factory-direct supply of custom cut-to-length Longspan sheets, Metcopo profiles,
              stone-coated shingles, step tiles, and precision CNC flashings. Zero end-lap leaks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
              >
                <span>Browse Materials & Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/fabrication"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700 transition-all hover:border-slate-600"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Request Custom Fabrication</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
              <div>
                <span className="block text-2xl font-black text-white">25+</span>
                <span className="text-xs text-slate-400">Years Warranty</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">0mm</span>
                <span className="text-xs text-slate-400">End-Lap Leak Risk</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">Up to 30m</span>
                <span className="text-xs text-slate-400">Continuous Lengths</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">100%</span>
                <span className="text-xs text-slate-400">Micrometer Tested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
              Material Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore Our Roofing & Fabrication Line
            </h2>
          </div>
          <Link
            href="/categories"
            className="mt-4 md:mt-0 text-sm font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                <Image
                  src={
                    cat.image_url ||
                    "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <span>Explore Profiles</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Materials & Profiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
              Featured Materials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Engineered Profiles & Pre-Coated Sheets
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Browse Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. On-Site Roll Forming Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl overflow-hidden p-8 sm:p-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>Specialized Mobile Rig</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Continuous Length On-Site Roll Forming Service
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Why risk roof leaks caused by overlapping short sheets? Our mobile hydraulic
                roll-forming units travel to your site to manufacture single-span sheets up to 30
                metres long, measured and cut to the millimetre.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Eliminates horizontal lap joints that harbour wind-driven water</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Faster roof sheeting installation with 60% less labour time</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Certified raw coil certificates provided for every production batch</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/fabrication"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10"
                >
                  <span>Book Mobile Rig or Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="Automated Roll Forming Rig"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us / Quality Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
            Engineering Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Built for Durability, Wind Resistance & Weather Tightness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Genuine Gauge Thickness</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We never supply undersized coils. If you pay for 0.50mm or 0.55mm, your materials will
              pass digital micrometer inspection upon delivery.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Precision Cut-To-Length</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated computerized shear cutters eliminate uneven ragged edges, reducing site
              waste and ensuring seamless alignment on your trusses.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dedicated Transport Logistics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Specially cushioned long-bed trailers ensure your high-gloss and matte finished sheets
              arrive without scratches, dents, or road damage.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Technical Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need Roof Measurement or Bill of Quantities (BOQ) Assistance?
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Our structural roofing specialists can review your architectural roof plan and
              calculate precise sheet counts, ridge caps, valley gutters, and screws.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+2348007663464"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm px-5 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call Technical Support</span>
            </a>
            <Link
              href="/fabrication"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-5 py-3 rounded-lg transition-colors shadow-lg shadow-amber-500/10"
            >
              <span>Submit Roof Plan</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products/queries";
import { ProductConfigurator } from "@/components/products/ProductConfigurator";
import {
  ShieldCheck,
  Award,
  Ruler,
  ChevronRight,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Roofing Construction Shop",
    };
  }

  return {
    title: `${product.name} | Roofing Construction Shop`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <Link href="/products" className="hover:text-amber-400 transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-amber-400 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Grid: Gallery on left, Configurator & Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery & Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          {/* Description Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">Product Engineering Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Precision Corrugated Profile</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Anti-Corrosion Marine Primer</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>UV-Resistant Polyvinylidene Coating</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Factory Certified Tensile Strength</span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-slate-800/80">
                        <td className="py-3 pr-4 font-semibold text-slate-400 capitalize w-1/3">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 text-white font-medium">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Product Details & Configurator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
              {product.category?.name || "Roofing Material"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Dynamic Interactive Configurator */}
          <ProductConfigurator product={product} />

          {/* Trust Guarantees */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Certified thickness guaranteed by digital micrometer test</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Backed by 25-50 year factory warranty against chipping</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Class A non-combustible fire rating certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getFeaturedProducts } from "@/lib/products/queries";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Roofing Materials",
    };
  }

  return {
    title: `${product.name} | Roofix Industrial Materials`,
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

  // Fetch related products for the "You Might Also Like" section
  const allFeatured = await getFeaturedProducts();
  const relatedProducts = allFeatured.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Breadcrumb Navigation (Matching Image 1) */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link href="/products" className="hover:text-blue-600 transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Interactive Product Detail View (Gallery, Swatches, Calculator, CTAs, Tabs) */}
      <ProductDetailView product={product} relatedProducts={relatedProducts} />

      {/* 3. "You Might Also Like" Product Recommendations Grid (Matching Image 1) */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Complementary Accessories
            </span>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              You Might Also Like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <ProductCard
                key={p.id}
                product={p}
                discountPercent={idx === 1 ? 15 : undefined}
                rating={5}
                reviewCount={8 + idx * 3}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

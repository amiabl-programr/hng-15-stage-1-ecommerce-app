import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Ruler, Wrench, Box } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80";

  const getProductTypeBadge = () => {
    switch (product.product_type) {
      case "dimensioned":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
            <Ruler className="w-3 h-3" />
            Custom Length
          </span>
        );
      case "service":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
            <Wrench className="w-3 h-3" />
            Service
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded font-medium">
            <Box className="w-3 h-3" />
            Standard
          </span>
        );
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-amber-500/5">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {getProductTypeBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">
            {product.category?.name || "Roofing Material"}
          </div>
          <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs mt-2 line-clamp-2">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {product.product_type === "dimensioned" ? "Price per linear metre" : "Price"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-white">
                {formatCurrency(product.base_price)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                /{product.unit}
              </span>
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/10"
          >
            <span>{product.product_type === "dimensioned" ? "Configure" : "View"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

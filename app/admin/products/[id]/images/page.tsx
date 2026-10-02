import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getManifestEntry } from "@/lib/products/image-manifest";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import type { ProductImage } from "@/types/database";

export const metadata = {
  title: "Product Images | Admin Portal",
};

export default async function AdminProductImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminDb = createAdminClient();

  const { data: product } = await adminDb
    .from("products")
    .select("id, name, slug, images:product_images(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const images = (product.images ?? []) as ProductImage[];
  const suggestedAlt =
    getManifestEntry(product.slug).assets.find((a) => a.role === "main")?.alt ??
    `Photograph of ${product.name}`;

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to products
      </Link>

      <ProductImageManager
        productId={product.id}
        productName={product.name}
        productSlug={product.slug}
        images={images}
        suggestedAlt={suggestedAlt}
      />
    </div>
  );
}
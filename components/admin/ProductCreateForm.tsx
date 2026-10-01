"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/database";
import { createProductAction } from "@/lib/admin/actions";
import { uploadProductImage } from "@/lib/storage/upload";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProductCreateFormProps {
  categories: Category[];
}

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [productType, setProductType] = useState<"standard" | "dimensioned" | "service">("dimensioned");
  const [basePrice, setBasePrice] = useState<number>(3800);
  const [unit, setUnit] = useState<"piece" | "metre" | "bundle" | "sqm" | "service" | "roll">("metre");
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(10);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

    const uploadRes = await uploadProductImage(file);
    setUploadingImage(false);

    if (uploadRes.success && uploadRes.url) {
      setImageUrl(uploadRes.url);
    } else {
      setErrorMessage(uploadRes.error || "Image upload failed. You may also provide an image URL directly.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !slug || !categoryId || !description) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    const res = await createProductAction({
      name,
      slug,
      categoryId,
      description,
      shortDescription: shortDescription || undefined,
      productType,
      basePrice,
      unit,
      minOrderQuantity,
      imageUrl: imageUrl || undefined,
    });
    setSubmitting(false);

    if (res.success) {
      router.push("/admin/products");
    } else {
      setErrorMessage(res.error || "Failed to create product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Product / Sheet Profile Name *
          </label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Metcopo Heavy Zinc Profile"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            URL Slug (SEO-friendly) *
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="metcopo-heavy-zinc-profile"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Product Type *</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="dimensioned">Dimensioned Sheet (Cut-to-Length / Linear Metres)</option>
            <option value="standard">Standard Physical Product (Per Piece/Bundle)</option>
            <option value="service">Fabrication / Machine Service</option>
          </select>
        </div>

        {/* Base Price */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Base Unit Price (₦) *
          </label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Pricing Unit *</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="metre">metre (Linear metres)</option>
            <option value="piece">piece (Tiles, ridge caps, flashings)</option>
            <option value="bundle">bundle (Screws, clips)</option>
            <option value="sqm">sqm (Square metres)</option>
            <option value="roll">roll (Sealant tapes, membranes)</option>
            <option value="service">service (Roll forming rig deployment)</option>
          </select>
        </div>

        {/* Min Order Qty */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Minimum Order Quantity
          </label>
          <input
            type="number"
            value={minOrderQuantity}
            onChange={(e) => setMinOrderQuantity(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Image Upload / URL */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Product Image (Supabase Storage or Web URL)
          </label>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              disabled={uploadingImage}
              className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-750 cursor-pointer"
            />
          </div>
          {uploadingImage && (
            <div className="flex items-center gap-2 text-xs text-amber-500 mt-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading to Supabase Storage &apos;products&apos; bucket...</span>
            </div>
          )}
          {imageUrl && (
            <div className="mt-2 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded border border-slate-700 overflow-hidden">
                <Image src={imageUrl} alt="Uploaded preview" fill className="object-cover" />
              </div>
              <span className="text-[11px] text-emerald-400">Image attached successfully</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Short Technical Summary
          </label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="e.g. 0.50mm stepped metal profile with high UV resistance"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Full Description */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Full Engineering Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Detailed alloy composition, corrosion resistance ratings, recommended purlin spacing..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 disabled:opacity-50"
        >
          {submitting ? "Publishing Product..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}

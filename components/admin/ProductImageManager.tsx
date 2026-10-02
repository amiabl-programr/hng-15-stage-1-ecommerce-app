"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Star, Trash2, ArrowUp, ArrowDown, Upload, Check } from "lucide-react";
import { uploadProductImage } from "@/lib/storage/upload";
import {
  attachProductImageAction,
  setPrimaryProductImageAction,
  updateProductImageAction,
  removeProductImageAction,
} from "@/lib/admin/image-actions";
import type { ProductImage } from "@/types/database";

interface ProductImageManagerProps {
  productId: string;
  productName: string;
  productSlug: string;
  images: ProductImage[];
  /** Alt text drafted in the asset manifest for this product's main image. */
  suggestedAlt: string;
}

export function ProductImageManager({
  productId,
  productName,
  productSlug,
  images,
  suggestedAlt,
}: ProductImageManagerProps) {
  const [items, setItems] = useState<ProductImage[]>(() =>
    [...images].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order
    )
  );
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(images.map((img) => [img.id, img.alt_text ?? ""]))
  );
  const [newAlt, setNewAlt] = useState(suggestedAlt);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const announce = (message: string) => {
    setNotice(message);
    setError(null);
    setTimeout(() => setNotice(null), 3000);
  };

  const fail = (message: string) => {
    setError(message);
    setNotice(null);
  };

  const handleUpload = (file: File) => {
    setError(null);
    uploadProductImage(file).then((result) => {
      if (!result.success || !result.url) {
        fail(result.error ?? "Upload failed.");
        return;
      }
      startTransition(async () => {
        const alt = newAlt.trim() || `${productName}`;
        const res = await attachProductImageAction({
          productId,
          imageUrl: result.url,
          altText: alt,
        });
        if (!res.success) {
          fail(res.error ?? "Could not attach the image.");
          return;
        }
        announce("Image added.");
      });
    });
  };

  const setPrimary = (id: string) => {
    startTransition(async () => {
      const res = await setPrimaryProductImageAction({ imageId: id });
      if (!res.success) return fail(res.error ?? "Could not update.");
      setItems((prev) => prev.map((i) => ({ ...i, is_primary: i.id === id })));
      announce("Main image updated.");
    });
  };

  const saveAlt = (id: string) => {
    const altText = (altDrafts[id] ?? "").trim();
    if (altText.length < 8) return fail("Alt text needs at least 8 characters.");
    const current = items.find((i) => i.id === id);
    startTransition(async () => {
      const res = await updateProductImageAction({
        imageId: id,
        altText,
        displayOrder: current?.display_order ?? 0,
      });
      if (!res.success) return fail(res.error ?? "Could not save.");
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, alt_text: altText } : i)));
      announce("Alt text saved.");
    });
  };

  const move = (id: string, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const index = next.findIndex((i) => i.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const commitOrder = () => {
    startTransition(async () => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.display_order === i + 1) continue;
        const res = await updateProductImageAction({
          imageId: item.id,
          altText: (altDrafts[item.id] ?? item.alt_text ?? "").trim() || item.id,
          displayOrder: i + 1,
        });
        if (!res.success) return fail(res.error ?? "Could not save the order.");
        setItems((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, display_order: i + 1 } : x))
        );
      }
      announce("Order saved.");
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const res = await removeProductImageAction({ imageId: id });
      if (!res.success) return fail(res.error ?? "Could not remove.");
      const remaining = items.filter((i) => i.id !== id);
      setItems(remaining);
      announce("Image removed.");
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Catalogue Imagery
        </span>
        <h1 className="text-3xl font-black text-white mt-1">{productName}</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Until a photograph is published, the storefront shows a drawn cross-section of the
          profile. Add a real photograph to replace it.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-xl px-4 py-3">
          {notice}
        </p>
      )}

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Add a photograph</h2>

        <div className="space-y-2">
          <label htmlFor="alt-text" className="block text-xs font-semibold text-slate-400">
            Alt text
          </label>
          <input
            id="alt-text"
            type="text"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            maxLength={200}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-[11px] text-slate-500">
            Describe this specific product. &ldquo;image1&rdquo; and &ldquo;product photo&rdquo; are not
            descriptions.
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Choose image</span>
        </button>
        <p className="text-[11px] text-slate-500">JPEG, PNG or WebP. 5 MB maximum.</p>
      </section>

      {items.length === 0 ? (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <p className="text-sm text-slate-400">
            No photographs yet. The storefront is drawing the profile cross-section instead.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              {items.length} image{items.length === 1 ? "" : "s"}
            </h2>
            <button
              type="button"
              onClick={commitOrder}
              disabled={busy}
              className="text-xs font-semibold text-amber-400 hover:underline disabled:opacity-50"
            >
              Save order
            </button>
          </div>

          <ul className="space-y-3">
            {items.map((img, index) => (
              <li
                key={img.id}
                className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4"
              >
                <div className="relative w-full sm:w-28 aspect-square rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text ?? `${productName} image`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {img.is_primary && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Main image
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-mono">{productSlug}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label htmlFor={`alt-${img.id}`} className="sr-only">
                      Alt text for image {index + 1}
                    </label>
                    <input
                      id={`alt-${img.id}`}
                      type="text"
                      value={altDrafts[img.id] ?? ""}
                      onChange={(e) =>
                        setAltDrafts((prev) => ({ ...prev, [img.id]: e.target.value }))
                      }
                      maxLength={200}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => saveAlt(img.id)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!img.is_primary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(img.id)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-400 disabled:opacity-50"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Make main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => move(img.id, -1)}
                      disabled={busy || index === 0}
                      aria-label={`Move image ${index + 1} earlier`}
                      className="text-slate-400 hover:text-amber-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(img.id, 1)}
                      disabled={busy || index === items.length - 1}
                      aria-label={`Move image ${index + 1} later`}
                      className="text-slate-400 hover:text-amber-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(img.id)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
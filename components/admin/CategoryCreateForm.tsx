"use client";

import { useState } from "react";
import { createCategoryAction } from "@/lib/admin/actions";
import { uploadProductImage } from "@/lib/storage/upload";
import { Plus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function CategoryCreateForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);
    const res = await uploadProductImage(file);
    setUploadingImage(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setErrorMsg(res.error || "Failed uploading category cover image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);

    if (!name || !slug || !description) {
      setErrorMsg("Please fill out name, slug, and description.");
      return;
    }

    setSubmitting(true);
    const res = await createCategoryAction({
      name,
      slug,
      description,
      imageUrl: imageUrl || undefined,
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setName("");
      setSlug("");
      setDescription("");
      setImageUrl("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setErrorMsg(res.error || "Failed to create category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Plus className="w-4 h-4 text-amber-500" />
        <span>Create New Category</span>
      </h2>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {errorMsg}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Category created successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Category Name *</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Zinc Standing Seam"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Category Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="zinc-standing-seam"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">Description *</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of products falling under this category..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadingImage}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-slate-800 file:text-amber-400 cursor-pointer"
          />
          {uploadingImage && (
            <span className="text-xs text-amber-500 flex items-center gap-1 mt-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Category"}
        </button>
      </div>
    </form>
  );
}

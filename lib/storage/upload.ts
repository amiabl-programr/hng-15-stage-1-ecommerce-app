import { createClient } from "@/lib/supabase/client";

export async function uploadProductImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  // 1. Validate format
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, and WebP images are allowed." };
  }

  // 2. Validate size (Max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Image file exceeds 5MB size limit." };
  }

  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Storage Upload Error]:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: msg };
  }
}

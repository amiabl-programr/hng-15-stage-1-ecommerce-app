/**
 * Product & Category image uploader
 * Dispatches file to authenticated server endpoint /api/admin/upload
 */

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
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Failed to upload image." };
    }

    return { success: true, url: data.url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: msg };
  }
}

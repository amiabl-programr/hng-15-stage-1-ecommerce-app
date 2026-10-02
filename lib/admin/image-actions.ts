"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Catalogue image management.
 *
 * Upload already happens in /api/admin/upload. These actions cover the rest of
 * the lifecycle so a photograph can be published, reordered, captioned, or
 * removed without editing application code.
 */

async function verifyAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: Please sign in.");

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isEnvAdmin = session.email && adminEmails.includes(session.email.toLowerCase());

  if (session.role === "admin" || isEnvAdmin) return session;
  throw new Error("Forbidden: Administrator privileges required.");
}

const attachSchema = z.object({
  productId: z.string().uuid("Invalid product."),
  imageUrl: z.string().url("Invalid image address."),
  altText: z
    .string()
    .trim()
    .min(8, "Describe the image in at least 8 characters.")
    .max(200, "Keep alt text under 200 characters."),
});

export async function attachProductImageAction(input: unknown) {
  const parsed = attachSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { productId, imageUrl, altText } = parsed.data;

  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { count } = await adminDb
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    const isFirst = (count ?? 0) === 0;

    const { error } = await adminDb.from("product_images").insert({
      product_id: productId,
      image_url: imageUrl,
      alt_text: altText,
      display_order: (count ?? 0) + 1,
      is_primary: isFirst,
    });

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error && /^(Unauthorized|Forbidden)/.test(err.message)
          ? err.message
          : "Could not attach the image.",
    };
  }
}

const setPrimarySchema = z.object({ imageId: z.string().uuid("Invalid image.") });

export async function setPrimaryProductImageAction(input: unknown) {
  const parsed = setPrimarySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid image." };

  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { data: image, error: findError } = await adminDb
      .from("product_images")
      .select("id, product_id")
      .eq("id", parsed.data.imageId)
      .single();

    if (findError || !image) return { success: false, error: "Image not found." };

    await adminDb.from("product_images").update({ is_primary: false }).eq("product_id", image.product_id);

    const { error } = await adminDb
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", image.id);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error && /^(Unauthorized|Forbidden)/.test(err.message)
          ? err.message
          : "Could not update the primary image.",
    };
  }
}

const updateSchema = z.object({
  imageId: z.string().uuid("Invalid image."),
  altText: z
    .string()
    .trim()
    .min(8, "Describe the image in at least 8 characters.")
    .max(200, "Keep alt text under 200 characters."),
  displayOrder: z.number().int().min(0),
});

export async function updateProductImageAction(input: unknown) {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { error } = await adminDb
      .from("product_images")
      .update({ alt_text: parsed.data.altText, display_order: parsed.data.displayOrder })
      .eq("id", parsed.data.imageId);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error && /^(Unauthorized|Forbidden)/.test(err.message)
          ? err.message
          : "Could not update the image.",
    };
  }
}

const removeSchema = z.object({ imageId: z.string().uuid("Invalid image.") });

export async function removeProductImageAction(input: unknown) {
  const parsed = removeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid image." };

  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { data: image, error: findError } = await adminDb
      .from("product_images")
      .select("id, product_id, image_url, is_primary")
      .eq("id", parsed.data.imageId)
      .single();

    if (findError || !image) return { success: false, error: "Image not found." };

    const { count } = await adminDb
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", image.product_id);

    const { error } = await adminDb.from("product_images").delete().eq("id", image.id);
    if (error) throw error;

    // Removing the primary image promotes the next one so the product never
    // renders with no image while photographs remain.
    if (image.is_primary && (count ?? 0) > 1) {
      const { data: next } = await adminDb
        .from("product_images")
        .select("id")
        .eq("product_id", image.product_id)
        .order("display_order", { ascending: true })
        .limit(1)
        .single();

      if (next) {
        await adminDb.from("product_images").update({ is_primary: true }).eq("id", next.id);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error && /^(Unauthorized|Forbidden)/.test(err.message)
          ? err.message
          : "Could not remove the image.",
    };
  }
}
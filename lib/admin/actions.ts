"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatus, PaymentStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

// Verification helper ensuring requesting user has admin role
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // Check if user's email is in ADMIN_EMAILS fallback
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (user.email && adminEmails.includes(user.email.toLowerCase())) {
      return user;
    }
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return user;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
) {
  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { error } = await adminDb.from("orders").update(updateData).eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/orders");
    revalidatePath(`/account/orders/${orderId}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update order status";
    return { success: false, error: msg };
  }
}

export async function updateStockAction(variantId: string, newQuantity: number) {
  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { error } = await adminDb
      .from("product_variants")
      .update({
        stock_quantity: Math.max(0, newQuantity),
        updated_at: new Date().toISOString(),
      })
      .eq("id", variantId);

    if (error) throw error;

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update stock";
    return { success: false, error: msg };
  }
}

export async function createProductAction(data: {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  productType: "standard" | "dimensioned" | "service";
  basePrice: number;
  unit: "piece" | "metre" | "bundle" | "sqm" | "service" | "roll";
  minOrderQuantity: number;
  imageUrl?: string;
}) {
  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { data: newProd, error } = await adminDb
      .from("products")
      .insert({
        name: data.name,
        slug: data.slug,
        category_id: data.categoryId,
        description: data.description,
        short_description: data.shortDescription || null,
        product_type: data.productType,
        base_price: data.basePrice,
        unit: data.unit,
        min_order_quantity: data.minOrderQuantity,
        is_active: true,
        is_featured: false,
      })
      .select()
      .single();

    if (error) throw error;

    if (data.imageUrl && newProd) {
      await adminDb.from("product_images").insert({
        product_id: newProd.id,
        image_url: data.imageUrl,
        is_primary: true,
        display_order: 1,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, productId: newProd.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create product";
    return { success: false, error: msg };
  }
}

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}) {
  try {
    await verifyAdmin();
    const adminDb = createAdminClient();

    const { error } = await adminDb.from("categories").insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.imageUrl || null,
      is_active: true,
    });

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: msg };
  }
}

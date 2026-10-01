"use server";

import { getSession, getCurrentUserProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Order, OrderStatus, PaymentStatus } from "@/types/database";
import { sendOrderStatusUpdateEmail } from "@/lib/mailgun";
import { revalidatePath } from "next/cache";

// Verification helper ensuring requesting user has admin role
async function verifyAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const isEnvAdmin = session.email && adminEmails.includes(session.email.toLowerCase());

  if (session.role === "admin" || isEnvAdmin) {
    return session;
  }

  const profile = await getCurrentUserProfile();
  if (profile?.role === "admin") {
    return session;
  }

  throw new Error("Forbidden: Administrator privileges required.");
}

function sanitizeAdminError(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (err.message.startsWith("Unauthorized") || err.message.startsWith("Forbidden")) {
      return err.message;
    }
  }
  return fallback;
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

    const { data: updatedOrder, error } = await adminDb
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    if (updatedOrder?.customer_email) {
      sendOrderStatusUpdateEmail(updatedOrder as Order, status).catch((mailErr) => {
        console.error("[Email Async Error] Order status notification failed:", mailErr);
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/account/orders/${orderId}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: sanitizeAdminError(err, "Failed to update order status.") };
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
    return { success: false, error: sanitizeAdminError(err, "Failed to update stock.") };
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
    return { success: false, error: sanitizeAdminError(err, "Failed to create product.") };
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
    return { success: false, error: sanitizeAdminError(err, "Failed to create category.") };
  }
}

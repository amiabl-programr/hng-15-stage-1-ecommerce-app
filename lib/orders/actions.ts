"use server";

import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderSchema, CreateOrderPayload } from "@/lib/validation/checkout";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/mailgun";
import { Order, OrderItem } from "@/types/database";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export async function createOrderAction(rawPayload: CreateOrderPayload): Promise<CreateOrderResult> {
  // 1. Validate payload structure using Zod
  const parseResult = createOrderSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues.map((i) => i.message).join(", ");
    // Log the rejected field paths only. Never log rawPayload: the customer
    // object carries email, phone and street address.
    console.error(
      "[Order Validation] Rejected payload:",
      parseResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
    return { success: false, error: `Invalid order details: ${errorDetails}` };
  }

  const { customer, items } = parseResult.data;

  try {
    // 2. Obtain session user if logged in
    const session = await getSession();

    // Use admin client for database validation & transaction writes
    const adminDb = createAdminClient();

    // 3. Re-verify each product, variant, and compute authoritative pricing
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const { data: dbProducts, error: prodErr } = await adminDb
      .from("products")
      .select("id, name, slug, product_type, base_price, unit, is_active, min_order_quantity")
      .in("id", productIds);

    if (prodErr || !dbProducts) {
      console.error("[Order Error] Failed fetching products from database.");
      return { success: false, error: "Unable to verify products. Please try again." };
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Fetch variants if applicable
    const variantIds = items.map((i) => i.variantId).filter(Boolean) as string[];
    let variantMap = new Map();
    if (variantIds.length > 0) {
      const { data: dbVariants, error: varErr } = await adminDb
        .from("product_variants")
        .select("id, product_id, name, sku, price_override, attributes, stock_quantity, is_active")
        .in("id", variantIds);

      if (!varErr && dbVariants) {
        variantMap = new Map(dbVariants.map((v) => [v.id, v]));
      }
    }

    let calculatedSubtotal = 0;
    const verifiedOrderItems: Array<{
      product_id: string;
      variant_id: string | null;
      product_name: string;
      unit_price: number;
      quantity: number;
      custom_specs: Record<string, unknown> | null;
      line_total: number;
    }> = [];

    // Check each requested item against verified database pricing and stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || !product.is_active) {
        return {
          success: false,
          error: `Product "${product?.name || item.productId}" is no longer available.`,
        };
      }

      if (item.quantity < (product.min_order_quantity || 1)) {
        return {
          success: false,
          error: `Minimum order quantity for "${product.name}" is ${product.min_order_quantity}.`,
        };
      }

      let effectiveUnitPrice = Number(product.base_price);
      let variantName = "";

      if (item.variantId) {
        const variant = variantMap.get(item.variantId);
        if (!variant || !variant.is_active || variant.product_id !== product.id) {
          return {
            success: false,
            error: `Selected option for "${product.name}" is unavailable.`,
          };
        }
        if (variant.price_override != null) {
          effectiveUnitPrice = Number(variant.price_override);
        }
        variantName = ` (${variant.name})`;

        // Check variant inventory
        if (variant.stock_quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${product.name}${variantName}". Available: ${variant.stock_quantity}.`,
          };
        }
      }

      // Calculate line total authoritatively on server
      let lineTotal = 0;
      if (product.product_type === "dimensioned" && item.customSpecs?.length_metres) {
        // Length in metres * price per metre * sheet quantity
        lineTotal = effectiveUnitPrice * item.customSpecs.length_metres * item.quantity;
      } else {
        lineTotal = effectiveUnitPrice * item.quantity;
      }

      calculatedSubtotal += lineTotal;

      verifiedOrderItems.push({
        product_id: product.id,
        variant_id: item.variantId || null,
        product_name: `${product.name}${variantName}`,
        unit_price: effectiveUnitPrice,
        quantity: item.quantity,
        custom_specs: item.customSpecs || null,
        line_total: lineTotal,
      });
    }

    // Flat standard delivery fee or 0 if self pickup
    const deliveryFee = calculatedSubtotal > 500000 ? 0 : 15000;
    const finalTotal = calculatedSubtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    const deliveryAddressJson = {
      recipient_name: customer.fullName,
      phone: customer.phone,
      street_address: customer.streetAddress,
      city: customer.city,
      state: customer.state,
      additional_instructions: customer.additionalInstructions || "",
    };

    // 4. Insert into orders table
    const { data: newOrder, error: orderInsertErr } = await adminDb
      .from("orders")
      .insert({
        order_number: orderNumber,
        profile_id: session?.id || null,
        status: "pending",
        payment_status: customer.paymentMethod === "pay_on_delivery" ? "pending" : "payment_pending",
        payment_method: customer.paymentMethod,
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: deliveryAddressJson,
        subtotal: calculatedSubtotal,
        delivery_fee: deliveryFee,
        total_amount: finalTotal,
        notes: customer.additionalInstructions || null,
      })
      .select("id, order_number, profile_id, status, payment_status, payment_method, customer_name, customer_email, customer_phone, delivery_address, subtotal, delivery_fee, total_amount, notes, created_at, updated_at")
      .single();

    if (orderInsertErr || !newOrder) {
      console.error("[Order Error] Failed creating order record.");
      return { success: false, error: "Failed to create order record. Please try again." };
    }

    const itemsToInsert = verifiedOrderItems.map((item) => ({
      order_id: newOrder.id,
      ...item,
    }));

    const { data: createdItems, error: itemsInsertErr } = await adminDb
      .from("order_items")
      .insert(itemsToInsert)
      .select();

    if (itemsInsertErr) {
      // The order row exists but its line items do not. Leaving it behind would
      // produce an order the customer sees as confirmed, that the admin views as
      // a real order, and that no email or invoice can itemise. Remove the empty
      // order so the customer retries against a clean slate.
      console.error("[Order Error] Failed creating order items, rolling back order.");
      await adminDb.from("orders").delete().eq("id", newOrder.id);
      return {
        success: false,
        error: "Failed to save your order items. No charge was made, please try again.",
      };
    }

    for (const item of verifiedOrderItems) {
      if (item.variant_id) {
        const { error: rpcErr } = await adminDb.rpc("decrement_variant_inventory", {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity,
        });
        if (rpcErr) {
          // The row-locking function is the only safe way to decrement. The old
          // read-then-write fallback could oversell, because two concurrent
          // checkouts both read the same stock before either wrote.
          console.error("[Order Error] Inventory decrement failed:", rpcErr.message);
          await adminDb.from("order_items").delete().eq("order_id", newOrder.id);
          await adminDb.from("orders").delete().eq("id", newOrder.id);
          return {
            success: false,
            error: "We could not confirm stock for one of your items. Please try again.",
          };
        }
      }
    }

    sendOrderConfirmationEmail(
      newOrder as Order,
      (createdItems || verifiedOrderItems) as OrderItem[]
    ).catch(() => {
      console.error("[Email Async Error] Email delivery failed.");
    });

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
    };
  } catch {
    console.error("[Checkout Server Action Exception] Unexpected checkout error.");
    return { success: false, error: "An unexpected error occurred during checkout." };
  }
}

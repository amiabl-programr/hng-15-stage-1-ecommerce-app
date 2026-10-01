import FormData from "form-data";
import Mailgun from "mailgun.js";
import { Order, OrderItem } from "@/types/database";
import { generateOrderConfirmationHtml } from "./templates/order-confirmation";

export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL || "Roofing Construction Shop <orders@example.com>";

  if (!apiKey || !domain) {
    console.warn("[Mailgun] Missing MAILGUN_API_KEY or MAILGUN_DOMAIN. Skipping email delivery.");
    return { success: false, error: "Mailgun not configured" };
  }

  try {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: "api", key: apiKey });

    const html = generateOrderConfirmationHtml(order, items);

    const messageData = {
      from: fromEmail,
      to: [order.customer_email],
      subject: `Order Confirmation #${order.order_number} - Roofing Construction Shop`,
      html,
      text: `Hello ${order.customer_name},\n\nThank you for your order #${order.order_number}.\nTotal: ₦${order.total_amount}\nStatus: ${order.status}\n\nWe are preparing your materials.`,
    };

    const response = await mg.messages.create(domain, messageData);
    console.log(`[Mailgun] Successfully sent order confirmation for #${order.order_number}:`, response.id);
    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown Mailgun error";
    console.error(`[Mailgun Error] Failed to send email for order #${order.order_number}:`, errorMessage);
    // Never throw - email failures must not corrupt the checkout flow
    return { success: false, error: errorMessage };
  }
}

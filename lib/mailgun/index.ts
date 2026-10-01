/**
 * Mailgun Transactional Email Service Facade
 * Provides high-level domain operations with structured logging and fault-tolerant dispatch.
 */

import { Order, OrderItem, FabricationRequest, OrderStatus } from "@/types/database";
import { sendMail } from "./service";
import { getMailgunConfig } from "./client";
import { emailLogger } from "./logger";
import { EmailSendResult } from "./types";
import {
  generateOrderConfirmationHtml,
  generateOrderConfirmationText,
} from "./templates/order-confirmation";
import {
  generateFabricationInquiryHtml,
  generateFabricationInquiryText,
} from "./templates/fabrication-inquiry";
import {
  generateOrderStatusHtml,
  generateOrderStatusText,
} from "./templates/order-status";

export * from "./types";
export { emailLogger } from "./logger";

/**
 * Checks whether Mailgun environment variables are fully configured.
 */
export function verifyMailgunConfiguration(): {
  isConfigured: boolean;
  domain?: string;
  fromEmail?: string;
} {
  const config = getMailgunConfig();
  if (!config) {
    return { isConfigured: false };
  }
  return {
    isConfigured: true,
    domain: config.domain,
    fromEmail: config.fromEmail,
  };
}

/**
 * Dispatches an order confirmation invoice email to the customer.
 * Fully isolated — errors are caught and logged without affecting database operations.
 */
export async function sendOrderConfirmationEmail(
  order: Order,
  items: OrderItem[]
): Promise<EmailSendResult> {
  const subject = `Order Confirmation #${order.order_number} - Roofing Construction Shop`;
  const html = generateOrderConfirmationHtml(order, items);
  const text = generateOrderConfirmationText(order, items);

  emailLogger.info("ORDER_CONFIRMATION_INIT", {
    subject,
    recipient: order.customer_email,
    details: {
      orderNumber: order.order_number,
      itemCount: items.length,
      totalAmount: order.total_amount,
    },
  });

  return await sendMail({
    to: order.customer_email,
    subject,
    html,
    text,
    tags: ["order-confirmation", "transactional"],
    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
    },
  });
}

/**
 * Dispatches a fabrication inquiry confirmation email to the contractor.
 */
export async function sendFabricationInquiryEmail(
  request: FabricationRequest
): Promise<EmailSendResult> {
  const subject = `Fabrication Inquiry Received - ${request.service_type.replace(/_/g, " ")}`;
  const html = generateFabricationInquiryHtml(request);
  const text = generateFabricationInquiryText(request);

  emailLogger.info("FABRICATION_INQUIRY_INIT", {
    subject,
    recipient: request.contact_email,
    details: {
      requestId: request.id,
      serviceType: request.service_type,
    },
  });

  return await sendMail({
    to: request.contact_email,
    subject,
    html,
    text,
    tags: ["fabrication-inquiry", "engineering"],
    metadata: {
      requestId: request.id,
      serviceType: request.service_type,
    },
  });
}

/**
 * Dispatches an order status change notification email to the customer.
 */
export async function sendOrderStatusUpdateEmail(
  order: Order,
  newStatus: OrderStatus,
  notes?: string
): Promise<EmailSendResult> {
  const subject = `Update on Order #${order.order_number}: ${newStatus.replace(/_/g, " ").toUpperCase()}`;
  const html = generateOrderStatusHtml(order, newStatus, notes);
  const text = generateOrderStatusText(order, newStatus, notes);

  emailLogger.info("ORDER_STATUS_EMAIL_INIT", {
    subject,
    recipient: order.customer_email,
    details: {
      orderNumber: order.order_number,
      newStatus,
    },
  });

  return await sendMail({
    to: order.customer_email,
    subject,
    html,
    text,
    tags: ["order-status-update", "dispatch"],
    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
      status: newStatus,
    },
  });
}

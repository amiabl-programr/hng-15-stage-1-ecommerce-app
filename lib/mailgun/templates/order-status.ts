import { Order, OrderStatus } from "@/types/database";

const STATUS_DESCRIPTIONS: Record<OrderStatus, { title: string; message: string; color: string }> = {
  pending: {
    title: "Order Placed",
    message: "Your order has been recorded and is awaiting payment confirmation.",
    color: "#64748b",
  },
  payment_pending: {
    title: "Payment Pending",
    message: "We are awaiting bank wire or electronic confirmation for your order.",
    color: "#d97706",
  },
  paid: {
    title: "Payment Confirmed",
    message: "Your payment has been successfully confirmed. Production has been queued.",
    color: "#059669",
  },
  processing: {
    title: "In Production / Shearing",
    message: "Your roofing sheets and accessories are currently on the factory shearing line.",
    color: "#0284c7",
  },
  ready_for_delivery: {
    title: "Ready for Dispatch",
    message: "Your materials are strapped, bundled, and staged in the loading bay.",
    color: "#7c3aed",
  },
  shipped: {
    title: "Out for Site Delivery",
    message: "Our crane/flatbed transport truck is en route to your construction site.",
    color: "#2563eb",
  },
  completed: {
    title: "Delivered & Completed",
    message: "Your materials have been offloaded and accepted at the destination site.",
    color: "#16a34a",
  },
  cancelled: {
    title: "Order Cancelled",
    message: "Your order has been cancelled. If this is unexpected, please contact dispatch.",
    color: "#dc2626",
  },
  refunded: {
    title: "Order Refunded",
    message: "A refund has been processed for your order.",
    color: "#9333ea",
  },
};

export function generateOrderStatusHtml(order: Order, newStatus: OrderStatus, notes?: string): string {
  const statusInfo = STATUS_DESCRIPTIONS[newStatus] || {
    title: newStatus.replace(/_/g, " "),
    message: "Your order status has been updated.",
    color: "#0f172a",
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Order Status Update - #${order.order_number}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
              ROOFING CONSTRUCTION SHOP
            </h1>
            <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">
              Order Status Dispatch Notification
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 8px 0;">Hello ${order.customer_name},</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                There is a new update regarding your order <strong>#${order.order_number}</strong>:
              </p>
            </div>

            <!-- Status Card -->
            <div style="background-color: #f8fafc; border-left: 4px solid ${statusInfo.color}; border-radius: 0 6px 6px 0; padding: 20px; margin-bottom: 24px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${statusInfo.color}; display: block; margin-bottom: 4px;">
                New Status
              </span>
              <h3 style="font-size: 20px; color: #0f172a; margin: 0 0 8px 0; font-weight: 800;">
                ${statusInfo.title}
              </h3>
              <p style="font-size: 14px; color: #334155; margin: 0; line-height: 1.5;">
                ${statusInfo.message}
              </p>
              ${
                notes
                  ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #475569;">
                      <strong>Dispatch Note:</strong> ${notes}
                    </div>`
                  : ""
              }
            </div>

            <!-- Destination Summary -->
            <div style="margin-bottom: 24px; font-size: 13px; color: #475569;">
              <strong>Delivery Destination:</strong> ${order.delivery_address.street_address}, ${order.delivery_address.city}, ${order.delivery_address.state}
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; text-align: center; font-size: 13px; color: #64748b;">
              Track live progress on your account portal or call our dispatch desk at <strong>+234 800 766 3464</strong>.
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateOrderStatusText(order: Order, newStatus: OrderStatus, notes?: string): string {
  const statusInfo = STATUS_DESCRIPTIONS[newStatus] || {
    title: newStatus,
    message: "Your order status has changed.",
    color: "",
  };

  return `
ORDER STATUS UPDATE - #${order.order_number}
===========================================
Customer: ${order.customer_name}
New Status: ${statusInfo.title}
Details: ${statusInfo.message}
${notes ? `Dispatch Note: ${notes}\n` : ""}
Delivery Destination: ${order.delivery_address.street_address}, ${order.delivery_address.city}

Thank you for choosing Roofing Construction Shop.
Technical dispatch: support@roofingco.com | +234 800 766 3464
  `.trim();
}

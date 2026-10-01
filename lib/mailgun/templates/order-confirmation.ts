import { Order, OrderItem } from "@/types/database";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function generateOrderConfirmationHtml(order: Order, items: OrderItem[]): string {
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;">
          <strong>${item.product_name}</strong>
          ${
            item.custom_specs
              ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  ${item.custom_specs.length_metres ? `Length: ${item.custom_specs.length_metres}m | ` : ""}
                  ${item.custom_specs.gauge ? `Gauge: ${item.custom_specs.gauge} | ` : ""}
                  ${item.custom_specs.colour ? `Colour: ${item.custom_specs.colour}` : ""}
                  ${item.custom_specs.special_instructions ? `<br/>Note: ${item.custom_specs.special_instructions}` : ""}
                </div>`
              : ""
          }
        </td>
        <td style="padding: 12px 8px; font-size: 14px; color: #475569; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; font-size: 14px; color: #475569; text-align: right;">
          ${formatCurrency(item.unit_price)}
        </td>
        <td style="padding: 12px 8px; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">
          ${formatCurrency(item.line_total)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - ${order.order_number}</title>
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
              Industrial & Residential Roofing Materials • Fabrication & Roll Forming
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 8px 0;">Thank You for Your Order!</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                Hello <strong>${order.customer_name}</strong>, we have received your order <strong>#${order.order_number}</strong> placed on ${formatDateTime(order.created_at)}. Our production and logistics team is now preparing your invoice and dispatch schedule.
              </p>
            </div>

            <!-- Order Information Box -->
            <div style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
              <table width="100%" style="font-size: 13px; color: #475569;">
                <tr>
                  <td style="padding-bottom: 8px;"><strong>Order Number:</strong> ${order.order_number}</td>
                  <td style="padding-bottom: 8px;"><strong>Payment Status:</strong> <span style="text-transform: capitalize; color: #d97706; font-weight: 600;">${order.payment_status}</span></td>
                </tr>
                <tr>
                  <td><strong>Customer Email:</strong> ${order.customer_email}</td>
                  <td><strong>Customer Phone:</strong> ${order.customer_phone}</td>
                </tr>
              </table>
            </div>

            <!-- Delivery Address -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin: 0 0 8px 0;">Delivery Address</h3>
              <p style="font-size: 14px; color: #1e293b; margin: 0; line-height: 1.4;">
                ${order.delivery_address.recipient_name}<br/>
                ${order.delivery_address.street_address}<br/>
                ${order.delivery_address.city}, ${order.delivery_address.state}<br/>
                Phone: ${order.delivery_address.phone}
                ${order.delivery_address.additional_instructions ? `<br/><em>Notes: ${order.delivery_address.additional_instructions}</em>` : ""}
              </p>
            </div>

            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">
                  <th style="padding: 10px 8px;">Item & Specs</th>
                  <th style="padding: 10px 8px; text-align: center;">Qty</th>
                  <th style="padding: 10px 8px; text-align: right;">Unit Price</th>
                  <th style="padding: 10px 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px 8px 4px 8px; text-align: right; font-size: 14px; color: #64748b;">Subtotal:</td>
                  <td style="padding: 12px 8px 4px 8px; text-align: right; font-size: 14px; color: #1e293b;">${formatCurrency(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 4px 8px; text-align: right; font-size: 14px; color: #64748b;">Delivery Fee:</td>
                  <td style="padding: 4px 8px; text-align: right; font-size: 14px; color: #1e293b;">${formatCurrency(order.delivery_fee)}</td>
                </tr>
                <tr style="border-top: 2px solid #0f172a;">
                  <td colspan="3" style="padding: 12px 8px; text-align: right; font-size: 16px; font-weight: 700; color: #0f172a;">Total Payable:</td>
                  <td style="padding: 12px 8px; text-align: right; font-size: 16px; font-weight: 700; color: #0f172a;">${formatCurrency(order.total_amount)}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Support Footer -->
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; text-align: center; font-size: 13px; color: #64748b;">
              Questions about this order or customized fabrication? Contact our technical dispatch team at <a href="mailto:support@roofingco.com" style="color: #2563eb; text-decoration: none;">support@roofingco.com</a> or call <strong>+234 800 766 3464</strong>.
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateOrderConfirmationText(order: Order, items: OrderItem[]): string {
  const itemsText = items
    .map((item) => `- ${item.product_name} x ${item.quantity}: ${formatCurrency(item.line_total)}`)
    .join("\n");

  return `
ROOFING CONSTRUCTION SHOP - ORDER CONFIRMATION
===============================================
Order Number: ${order.order_number}
Order Date: ${formatDateTime(order.created_at)}
Customer: ${order.customer_name} (${order.customer_email})
Delivery To: ${order.delivery_address.street_address}, ${order.delivery_address.city}, ${order.delivery_address.state}

ITEMS ORDERED:
${itemsText}

Subtotal: ${formatCurrency(order.subtotal)}
Delivery Fee: ${formatCurrency(order.delivery_fee)}
Total Payable: ${formatCurrency(order.total_amount)}
Payment Method: ${order.payment_method}
Payment Status: ${order.payment_status}

Thank you for your order. Our logistics team will contact you regarding dispatch.
Technical dispatch: support@roofingco.com | +234 800 766 3464
  `.trim();
}


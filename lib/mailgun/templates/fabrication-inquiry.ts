import { FabricationRequest } from "@/types/database";
import { formatDateTime } from "@/lib/utils";

export function generateFabricationInquiryHtml(request: FabricationRequest): string {
  const specs = request.specifications as Record<string, any>;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Fabrication Request Received - Roofing Construction Shop</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
              ROOFING CONSTRUCTION SHOP
            </h1>
            <p style="color: #f59e0b; margin: 6px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">
              Bespoke Fabrication &amp; Engineering Division
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 8px 0;">We Have Received Your Fabrication Inquiry</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                Hello <strong>${request.contact_name}</strong>, thank you for contacting our engineering unit regarding your custom metal work on ${formatDateTime(request.created_at)}. Our factory technical estimators will review your job requirements and contact you with a formal quote and production lead-time.
              </p>
            </div>

            <!-- Specs Table -->
            <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin: 0 0 12px 0;">Technical Specifications</h3>
              <table width="100%" style="font-size: 13px; color: #334155; line-height: 1.6;">
                <tr>
                  <td width="40%"><strong>Service Type:</strong></td>
                  <td style="text-transform: capitalize; color: #0f172a; font-weight: 600;">${request.service_type.replace(/_/g, " ")}</td>
                </tr>
                ${
                  specs?.lengthInMetres
                    ? `<tr><td><strong>Required Length:</strong></td><td>${specs.lengthInMetres} metres</td></tr>`
                    : ""
                }
                ${
                  specs?.thickness
                    ? `<tr><td><strong>Material Thickness:</strong></td><td>${specs.thickness}</td></tr>`
                    : ""
                }
                ${
                  specs?.material
                    ? `<tr><td><strong>Material Alloy:</strong></td><td>${specs.material}</td></tr>`
                    : ""
                }
                ${
                  specs?.projectLocation
                    ? `<tr><td><strong>Project Site:</strong></td><td>${specs.projectLocation}</td></tr>`
                    : ""
                }
                ${
                  request.notes
                    ? `<tr><td><strong>Contractor Notes:</strong></td><td><em>${request.notes}</em></td></tr>`
                    : ""
                }
              </table>
            </div>

            <!-- Contact Recap -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 13px; text-transform: uppercase; color: #64748b; margin: 0 0 6px 0;">Registered Contact</h3>
              <p style="font-size: 13px; color: #475569; margin: 0;">
                Email: ${request.contact_email} | Phone: ${request.contact_phone}
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; text-align: center; font-size: 13px; color: #64748b;">
              Have technical blueprints or drawings to attach? Email them directly to <a href="mailto:engineering@roofingco.com" style="color: #2563eb; text-decoration: none;">engineering@roofingco.com</a> referencing this request.
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generateFabricationInquiryText(request: FabricationRequest): string {
  const specs = request.specifications as Record<string, any>;

  return `
ROOFING FABRICATION & ROLL FORMING INQUIRY
==========================================
Service: ${request.service_type}
Contact: ${request.contact_name} (${request.contact_email} | ${request.contact_phone})
Date: ${formatDateTime(request.created_at)}

SPECIFICATIONS:
- Length: ${specs?.lengthInMetres || "N/A"} metres
- Thickness: ${specs?.thickness || "N/A"}
- Material: ${specs?.material || "N/A"}
- Site Location: ${specs?.projectLocation || "N/A"}
- Notes: ${request.notes || "None"}

We have received your request and our engineering estimators will be in touch.
Technical dispatch: engineering@roofingco.com
  `.trim();
}

"use server";

import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { fabricationRequestSchema, FabricationRequestFormData } from "@/lib/validation/checkout";
import { sendFabricationInquiryEmail } from "@/lib/mailgun";

export async function submitFabricationRequestAction(rawPayload: FabricationRequestFormData) {
  const parseResult = fabricationRequestSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues.map((i) => i.message).join(", "),
    };
  }

  const data = parseResult.data;

  try {
    const session = await getSession();

    const adminDb = createAdminClient();

    const { data: requestRecord, error } = await adminDb
      .from("fabrication_requests")
      .insert({
        profile_id: session?.id || null,
        service_type: data.serviceType,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        specifications: {
          lengthInMetres: data.lengthInMetres,
          thickness: data.thickness,
          material: data.material,
          projectLocation: data.projectLocation,
        },
        notes: data.specialInstructions || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[Fabrication Action Error] Database error occurred.");
      return { success: false, error: "Failed to submit request. Please try again." };
    }

    // Dispatch asynchronous inquiry confirmation email
    sendFabricationInquiryEmail(requestRecord as any).catch((mailErr) => {
      console.error("[Email Async Error] Fabrication inquiry email error:", mailErr);
    });

    return { success: true, requestId: requestRecord.id };
  } catch {
    console.error("[Fabrication Action Exception] Unexpected error occurred.");
    return { success: false, error: "Failed to submit request. Please try again." };
  }
}

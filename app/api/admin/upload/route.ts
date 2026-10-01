import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized: Please sign in." }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const isEnvAdmin = session.email && adminEmails.includes(session.email.toLowerCase());

    if (session.role !== "admin" && !isEnvAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image file exceeds 5MB size limit." },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminDb.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Admin Storage Upload Error] Failed uploading file to storage.");
      return NextResponse.json({ success: false, error: "Failed to upload image." }, { status: 500 });
    }

    const { data } = adminDb.storage.from("products").getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch {
    console.error("[Admin Storage Upload Error] Unexpected upload error.");
    return NextResponse.json({ success: false, error: "Failed to upload image." }, { status: 500 });
  }
}

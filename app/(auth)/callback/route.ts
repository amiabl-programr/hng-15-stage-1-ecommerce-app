import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user's email matches the configured ADMIN_EMAILS environment variable
      const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
      const adminEmails = adminEmailsEnv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = data.user.email?.toLowerCase();
      if (userEmail && adminEmails.includes(userEmail)) {
        try {
          const adminDb = createAdminClient();
          await adminDb
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", data.user.id);
          console.log(`[Auth Callback] Promoted ${userEmail} to 'admin' role via ADMIN_EMAILS.`);
        } catch (err) {
          console.error("[Auth Callback] Failed auto-assigning admin role:", err);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to an error page or home
  return NextResponse.redirect(`${origin}/login?error=AuthenticationFailed`);
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

  // Supabase recently introduced the new API key format:
  // - "Secret key" (starts with sb_secret_...) which replaces legacy "service_role"
  // - Falls back to SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY
  const apiKey =
    process.env.SUPABASE_SECRET_KEY ||
    (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : null) ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-key";

  return createSupabaseClient(supabaseUrl, apiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

import { createAdminClient } from "@/lib/supabase/admin";
import { GoogleUserInfo } from "@/lib/auth/google";
import { Profile, UserRole } from "@/types/database";

/**
 * Checks if the given email is configured as an administrator in ADMIN_EMAILS
 */
export function isEmailConfiguredAdmin(email: string): boolean {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Saves or updates user details in the Supabase database (profiles table)
 * after successful Google OAuth authentication.
 */
export async function syncGoogleUserToDatabase(
  googleUser: GoogleUserInfo
): Promise<Profile> {
  const email = googleUser.email.trim().toLowerCase();
  const fullName =
    googleUser.name ||
    googleUser.given_name ||
    email.split("@")[0] ||
    "Google User";
  const avatarUrl = googleUser.picture || null;
  const googleId = googleUser.sub;

  const isAdmin = isEmailConfiguredAdmin(email);
  const adminDb = createAdminClient();

  // 1. Look up existing profile by google_id first
  let existingProfile: Profile | null = null;

  try {
    const { data: byGoogleId, error: errGoogle } = await adminDb
      .from("profiles")
      .select("*")
      .eq("google_id", googleId)
      .maybeSingle();

    if (!errGoogle && byGoogleId) {
      existingProfile = byGoogleId as Profile;
    }
  } catch (err) {
    console.warn("[User Sync] Query by google_id warning:", err);
  }

  // 2. If not found by google_id, look up by email
  if (!existingProfile) {
    try {
      const { data: byEmail, error: errEmail } = await adminDb
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (!errEmail && byEmail) {
        existingProfile = byEmail as Profile;
      }
    } catch (err) {
      console.warn("[User Sync] Query by email warning:", err);
    }
  }

  // Determine final role
  let role: UserRole = "customer";
  if (isAdmin || (existingProfile && existingProfile.role === "admin")) {
    role = "admin";
  }

  // 3. Update existing profile or Insert new profile
  if (existingProfile) {
    const updatedFields = {
      full_name: fullName,
      avatar_url: avatarUrl || existingProfile.avatar_url,
      google_id: googleId,
      role: role,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error: updateErr } = await adminDb
      .from("profiles")
      .update(updatedFields)
      .eq("id", existingProfile.id)
      .select()
      .single();

    if (updateErr) {
      console.error("[User Sync] Failed updating profile:", updateErr);
      // Return merged existing record so user can proceed
      return {
        ...existingProfile,
        ...updatedFields,
      };
    }

    console.log(`[User Sync] Successfully updated profile for ${email} (role: ${role})`);
    return updated as Profile;
  } else {
    // Insert new profile
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      email: email,
      full_name: fullName,
      avatar_url: avatarUrl,
      google_id: googleId,
      role: role,
      phone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await adminDb
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (insertErr) {
      console.error("[User Sync] Failed inserting new profile:", insertErr);
      // Still return new profile representation to establish session
      return newProfile;
    }

    console.log(`[User Sync] Successfully created new user profile for ${email} (role: ${role})`);
    return inserted as Profile;
  }
}

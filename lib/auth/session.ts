import { cookies } from "next/headers";
import { Profile, UserRole } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";

export const SESSION_COOKIE_NAME = "roofing_session";
const SESSION_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  googleId: string;
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "fallback-secret-for-roofing-construction-dev";
  return secret;
}

// Convert Buffer / Uint8Array to Base64URL string
function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Convert Base64URL string to Uint8Array
function fromBase64Url(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session payload into a compact, tamper-proof token: data.signature
 */
export async function signSessionToken(
  payload: Omit<SessionUser, "expiresAt">,
  expirationSeconds = SESSION_EXPIRATION_SECONDS
): Promise<string> {
  const sessionUser: SessionUser = {
    ...payload,
    expiresAt: Math.floor(Date.now() / 1000) + expirationSeconds,
  };

  const enc = new TextEncoder();
  const dataString = JSON.stringify(sessionUser);
  const dataBase64 = toBase64Url(enc.encode(dataString));

  const key = await getHmacKey(getSessionSecret());
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataBase64));
  const signatureBase64 = toBase64Url(signatureBuffer);

  return `${dataBase64}.${signatureBase64}`;
}

/**
 * Verifies a session token string and returns the parsed SessionUser if valid
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataBase64, signatureBase64] = parts;
    const enc = new TextEncoder();
    const key = await getHmacKey(getSessionSecret());

    const signatureBytes = fromBase64Url(signatureBase64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as Uint8Array<ArrayBuffer>,
      enc.encode(dataBase64)
    );

    if (!isValid) return null;

    const dataJson = new TextDecoder().decode(fromBase64Url(dataBase64));
    const session = JSON.parse(dataJson) as SessionUser;

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (session.expiresAt && session.expiresAt < nowSeconds) {
      return null; // Expired
    }

    return session;
  } catch {
    console.error("[Session] Verification failed.");
    return null;
  }
}

/**
 * Creates and sets the session cookie in Next.js Server Components / Route Handlers
 */
export async function setSessionCookie(profile: Profile): Promise<string> {
  const cookieStore = await cookies();

  const token = await signSessionToken({
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    avatarUrl: profile.avatar_url || null,
    role: profile.role,
    googleId: profile.google_id || "",
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRATION_SECONDS,
  });

  return token;
}

/**
 * Retrieves the current verified session from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Retrieves the fresh profile from database for the logged-in session user
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const adminDb = createAdminClient();
    const { data: profile } = await adminDb
      .from("profiles")
      .select("*")
      .eq("id", session.id)
      .single();

    if (profile) return profile as Profile;
  } catch {
    console.error("[Session] Error fetching fresh profile.");
  }

  // Fallback to session representation if DB call fails
  return {
    id: session.id,
    email: session.email,
    full_name: session.name,
    avatar_url: session.avatarUrl,
    google_id: session.googleId,
    role: session.role,
    phone: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

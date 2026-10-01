import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth/google";
import { syncGoogleUserToDatabase } from "@/lib/auth/user-sync";
import { setSessionCookie } from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("[Google OAuth Callback] Error returned from Google:", error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=MissingAuthorizationCode`);
  }

  // Parse state & verify CSRF
  let nextPath = "/account";
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;

  if (state) {
    try {
      const decodedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (savedState && decodedState.state !== savedState) {
        console.warn("[Google OAuth Callback] CSRF state mismatch detected.");
      }
      if (decodedState.next && typeof decodedState.next === "string") {
        nextPath = decodedState.next;
      }
    } catch (e) {
      console.warn("[Google OAuth Callback] Failed decoding state payload:", e);
    }
  }

  // Clear CSRF cookie
  cookieStore.set("oauth_state", "", { maxAge: 0, path: "/" });

  try {
    const redirectUri = `${origin}/api/auth/callback/google`;

    // 1. Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens({
      code,
      redirectUri,
    });

    // 2. Fetch authenticated user details from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // 3. Persist user details into Supabase PostgreSQL (public.profiles)
    const profile = await syncGoogleUserToDatabase(googleUser);

    // 4. Create and establish secure session cookie
    await setSessionCookie(profile);

    // If user is admin and was heading to default account, send to admin portal
    if (profile.role === "admin" && nextPath === "/account") {
      nextPath = "/admin";
    }

    console.log(
      `[Google OAuth] Authenticated ${profile.email} (${profile.role}). Redirecting to ${nextPath}`
    );

    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "AuthenticationFailed";
    console.error("[Google OAuth Callback] Authentication error:", err);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth/google";
import { syncGoogleUserToDatabase } from "@/lib/auth/user-sync";
import { setSessionCookie } from "@/lib/auth/session";

/**
 * Fallback callback route in case Google Cloud Console is configured with /callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/account";

  if (error) {
    console.error("[Auth Callback] Authentication error returned from provider.");
    return NextResponse.redirect(`${origin}/login?error=AuthenticationFailed`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=MissingAuthorizationCode`);
  }

  let nextPath = next;
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;

  if (state) {
    try {
      const decodedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (savedState && decodedState.state !== savedState) {
        console.warn("[Auth Callback] CSRF state mismatch detected.");
      }
      if (decodedState.next && typeof decodedState.next === "string") {
        nextPath = decodedState.next;
      }
    } catch {
      // Direct state string
    }
  }

  cookieStore.set("oauth_state", "", { maxAge: 0, path: "/" });

  try {
    const redirectUri = `${origin}/callback`;

    // 1. Exchange authorization code for tokens directly with Google
    const tokens = await exchangeCodeForTokens({
      code,
      redirectUri,
    });

    // 2. Fetch authenticated user details from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // 3. Persist user details into database
    const profile = await syncGoogleUserToDatabase(googleUser);

    // 4. Create and establish secure session cookie
    await setSessionCookie(profile);

    if (profile.role === "admin" && nextPath === "/account") {
      nextPath = "/admin";
    }

    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch {
    console.error("[Auth Callback] Google authentication error.");
    return NextResponse.redirect(`${origin}/login?error=AuthenticationFailed`);
  }
}

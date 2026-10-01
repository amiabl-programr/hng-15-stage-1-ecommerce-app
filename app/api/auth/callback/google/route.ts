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
    console.error("[Google OAuth Callback] Authentication error returned from provider.");
    return NextResponse.redirect(`${origin}/login?error=AuthenticationFailed`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=MissingAuthorizationCode`);
  }

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
    } catch {
      console.warn("[Google OAuth Callback] Failed decoding state payload.");
    }
  }

  cookieStore.set("oauth_state", "", { maxAge: 0, path: "/" });

  try {
    const redirectUri = `${origin}/api/auth/callback/google`;

    const tokens = await exchangeCodeForTokens({
      code,
      redirectUri,
    });

    const googleUser = await getGoogleUserInfo(tokens.access_token);
    const profile = await syncGoogleUserToDatabase(googleUser);

    await setSessionCookie(profile);

    if (profile.role === "admin" && nextPath === "/account") {
      nextPath = "/admin";
    }

    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch {
    console.error("[Google OAuth Callback] Authentication failed.");
    return NextResponse.redirect(`${origin}/login?error=AuthenticationFailed`);
  }
}

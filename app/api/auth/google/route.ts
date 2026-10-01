import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/auth/google";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const next = searchParams.get("next") || "/account";

    const randomState = crypto.randomUUID();
    const statePayload = Buffer.from(JSON.stringify({ state: randomState, next })).toString("base64url");

    const redirectUri = `${origin}/api/auth/callback/google`;

    const authUrl = buildGoogleAuthUrl({
      redirectUri,
      state: statePayload,
    });

    const cookieStore = await cookies();
    cookieStore.set("oauth_state", randomState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    return NextResponse.redirect(authUrl);
  } catch {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=ConfigurationError`);
  }
}

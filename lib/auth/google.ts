/**
 * Google OAuth 2.0 Client Utility
 * Direct Google OAuth without Supabase Auth
 */

export interface GoogleTokens {
  access_token: string;
  id_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
}

export interface GoogleUserInfo {
  sub: string; // Unique Google User Identifier
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Google OAuth credentials. Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env."
    );
  }

  return {
    clientId,
    clientSecret,
    appUrl,
  };
}

/**
 * Builds the Google OAuth 2.0 authorization URL to redirect user for consent.
 */
export function buildGoogleAuthUrl(options: {
  redirectUri: string;
  state: string;
}): string {
  const { clientId } = getGoogleConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: options.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: options.state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges the Google authorization code for access and ID tokens.
 */
export async function exchangeCodeForTokens(options: {
  code: string;
  redirectUri: string;
}): Promise<GoogleTokens> {
  const { clientId, clientSecret } = getGoogleConfig();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: options.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: options.redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Google OAuth] Token exchange failed.");
    throw new Error(
      data.error_description || data.error || "Failed to exchange authorization code with Google."
    );
  }

  return data as GoogleTokens;
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("[Google OAuth] Failed to fetch userinfo.");
    throw new Error("Failed to retrieve user profile from Google.");
  }

  const userInfo = (await response.json()) as GoogleUserInfo;

  if (!userInfo.email) {
    throw new Error("Google account did not return a valid email address.");
  }

  return userInfo;
}

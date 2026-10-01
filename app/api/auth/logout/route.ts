import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  await clearSessionCookie();
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  await clearSessionCookie();
  return NextResponse.redirect(`${origin}/login`);
}

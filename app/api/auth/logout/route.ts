import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { origin } = new URL(request.url);
    await clearSessionCookie();
    return NextResponse.redirect(`${origin}/login`, { status: 303 });
  } catch {
    return NextResponse.redirect("/login", { status: 303 });
  }
}

export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    await clearSessionCookie();
    return NextResponse.redirect(`${origin}/login`);
  } catch {
    return NextResponse.redirect("/login");
  }
}

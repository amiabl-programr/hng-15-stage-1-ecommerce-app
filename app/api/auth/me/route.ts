import { NextResponse } from "next/server";
import { getSession, getCurrentUserProfile } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const profile = await getCurrentUserProfile();

    return NextResponse.json({
      user: profile || session,
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

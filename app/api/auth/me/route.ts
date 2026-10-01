import { NextResponse } from "next/server";
import { getSession, getCurrentUserProfile } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Fetch freshest profile details
  const profile = await getCurrentUserProfile();

  return NextResponse.json({
    user: profile || session,
  });
}

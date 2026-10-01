"use server";

import { clearSessionCookie, getCurrentUserProfile as getProfileFromSession, getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function getCurrentUserProfile() {
  return await getProfileFromSession();
}

export async function getCurrentSession() {
  return await getSession();
}

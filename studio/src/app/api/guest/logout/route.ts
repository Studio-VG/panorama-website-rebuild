import { NextResponse } from "next/server";
import { clearGuestCookieHeader } from "@/lib/auth";

export async function POST() {
  return NextResponse.json({ ok: true }, { headers: { "Set-Cookie": clearGuestCookieHeader() } });
}

import { NextResponse } from "next/server";
import { guestCookieHeader, guestSessionToken } from "@/lib/auth";
import { getStore, isGuest } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const slug = String(payload.slug || "").trim();
  const password = String(payload.password || "");
  const guest = getStore().artists.find((artist) => artist.slug === slug && isGuest(artist));
  if (!guest?.portalPassword || guest.portalPassword !== password) {
    return NextResponse.json({ error: "That guest sign-in did not match." }, { status: 401 });
  }
  return NextResponse.json({ ok: true }, { headers: { "Set-Cookie": guestCookieHeader(guestSessionToken(guest.id, guest.portalPassword)) } });
}

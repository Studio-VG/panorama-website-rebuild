import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { GUEST_COOKIE, guestFromToken, readCookie } from "@/lib/auth";
import { stripOffsite } from "@/lib/contactGuard";
import { getStore, publicArtist, saveStore } from "@/lib/store";
import type { PortfolioImage } from "@/lib/types";

export const dynamic = "force-dynamic";

const blocked = ["phone", "email", "instagram", "facebook", "whatsapp", "instagramUrl", "facebookUrl", "whatsappUrl", "phoneAlt", "websiteUrl"];

export async function PUT(request: Request) {
  const store = getStore();
  const guest = guestFromToken(readCookie(request.headers.get("cookie"), GUEST_COOKIE), store.artists);
  if (!guest) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const payload = await request.json().catch(() => ({}));
  if (blocked.some((key) => key in (payload as object))) {
    return NextResponse.json({ error: "Off-site contact fields are not part of a guest profile." }, { status: 400 });
  }
  const name = stripOffsite(String(payload.name || guest.name)).slice(0, 80);
  const blurb = stripOffsite(String(payload.blurb || "")).slice(0, 600);
  const history = stripOffsite(String(payload.history || "")).slice(0, 4000);
  const styles = String(payload.styles || "")
    .split(",")
    .map((item) => stripOffsite(item))
    .filter(Boolean)
    .slice(0, 8);
  const portfolio = Array.isArray(payload.portfolio) ? payload.portfolio.slice(0, 12).map((item: Partial<PortfolioImage>) => ({
    id: String(item.id || randomUUID()),
    src: String(item.src || ""),
    alt: stripOffsite(String(item.alt || "")).slice(0, 180),
    caption: stripOffsite(String(item.caption || "")).slice(0, 180),
  })).filter((item: PortfolioImage) => item.src.startsWith("/")) : guest.portfolio;
  if (name.length < 2 || blurb.length < 12) {
    return NextResponse.json({ error: "Keep a name and a short text. Links and numbers are removed." }, { status: 400 });
  }
  const index = store.artists.findIndex((artist) => artist.id === guest.id);
  store.artists[index] = { ...store.artists[index], name, blurb, history, styles, portfolio };
  saveStore(store);
  return NextResponse.json({ artist: publicArtist(store.artists[index]), stripped: true });
}

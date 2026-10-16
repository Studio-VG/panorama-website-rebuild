import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { GUEST_COOKIE, guestFromToken, readCookie } from "@/lib/auth";
import { stripOffsite } from "@/lib/contactGuard";
import { getStore, publicThread, saveStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const store = getStore();
  const guest = guestFromToken(readCookie(request.headers.get("cookie"), GUEST_COOKIE), store.artists);
  if (!guest) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const threads = (store.threads || []).filter((thread) => thread.guestId === guest.id).map(publicThread);
  return NextResponse.json({ threads });
}

export async function POST(request: Request) {
  const store = getStore();
  const guest = guestFromToken(readCookie(request.headers.get("cookie"), GUEST_COOKIE), store.artists);
  if (!guest) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const payload = await request.json().catch(() => ({}));
  const thread = (store.threads || []).find((item) => item.id === payload.threadId && item.guestId === guest.id);
  if (!thread) return NextResponse.json({ error: "That conversation is not yours." }, { status: 404 });
  const text = stripOffsite(String(payload.body || "")).slice(0, 2000);
  if (text.length < 2) return NextResponse.json({ error: "Write a reply. Off-site links and numbers are removed." }, { status: 400 });
  thread.messages.push({ id: randomUUID(), from: "guest", body: text, createdAt: new Date().toISOString() });
  saveStore(store);
  return NextResponse.json({ thread: publicThread(thread) });
}

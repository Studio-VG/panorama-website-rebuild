import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readCookie } from "@/lib/auth";
import { stripOffsite } from "@/lib/contactGuard";
import { getStore, isGuest, saveStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const slug = String(payload.slug || "");
  const clientName = stripOffsite(String(payload.clientName || "")).slice(0, 80);
  const text = stripOffsite(String(payload.body || "")).slice(0, 2000);
  if (clientName.length < 2 || text.length < 2) {
    return NextResponse.json({ error: "Write a name and a message. Off-site links and numbers are removed." }, { status: 400 });
  }
  const store = getStore();
  const guest = store.artists.find((artist) => artist.slug === slug && isGuest(artist));
  if (!guest) return NextResponse.json({ error: "No such guest." }, { status: 404 });
  const threads = store.threads || [];
  const cookieName = `studio_client_${guest.id}`;
  const existingToken = readCookie(request.headers.get("cookie"), cookieName);
  let thread = threads.find((item) => item.guestId === guest.id && item.clientToken === existingToken);
  const token = thread?.clientToken || randomUUID();
  if (!thread) {
    thread = { id: randomUUID(), guestId: guest.id, clientName, clientToken: token, messages: [] };
    threads.push(thread);
  }
  thread.messages.push({ id: randomUUID(), from: "client", body: text, createdAt: new Date().toISOString() });
  store.threads = threads;
  saveStore(store);
  const response = NextResponse.json({ messages: thread.messages });
  response.cookies.set(cookieName, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 90 });
  return response;
}

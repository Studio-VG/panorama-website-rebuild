import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import { artistFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const index = store.artists.findIndex((artist) => artist.id === id);
  if (index < 0) return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const { artist, error } = artistFrom(body, store, store.artists[index]);
  if (!artist) return NextResponse.json({ error }, { status: 400 });
  store.artists[index] = artist;
  saveStore(store);
  return NextResponse.json({ artist });
}

export async function DELETE(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const next = store.artists.filter((artist) => artist.id !== id);
  if (next.length === store.artists.length) return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  store.artists = next;
  saveStore(store);
  return NextResponse.json({ ok: true });
}

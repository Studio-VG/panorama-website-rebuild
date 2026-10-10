import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import { locationFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const index = store.locations.findIndex((place) => place.id === id);
  if (index < 0) return NextResponse.json({ error: "Location not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const { location, error } = locationFrom(body, store.locations[index]);
  if (!location) return NextResponse.json({ error }, { status: 400 });
  store.locations[index] = location;
  saveStore(store);
  return NextResponse.json({ location });
}

export async function DELETE(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const next = store.locations.filter((place) => place.id !== id);
  if (next.length === store.locations.length) return NextResponse.json({ error: "Location not found." }, { status: 404 });
  store.locations = next;
  saveStore(store);
  return NextResponse.json({ ok: true });
}

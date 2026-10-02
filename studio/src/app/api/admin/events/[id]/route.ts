import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import { eventFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const index = store.events.findIndex((event) => event.id === id);
  if (index < 0) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const { event, error } = eventFrom(body, store, store.events[index]);
  if (!event) return NextResponse.json({ error }, { status: 400 });
  store.events[index] = event;
  saveStore(store);
  return NextResponse.json({ event });
}

export async function DELETE(request: Request, context: Context) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  const next = store.events.filter((event) => event.id !== id);
  if (next.length === store.events.length) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  store.events = next;
  saveStore(store);
  return NextResponse.json({ ok: true });
}

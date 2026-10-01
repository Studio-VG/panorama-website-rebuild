import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import { settingsFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const store = getStore();
  const { settings, error } = settingsFrom(body, store.settings);
  if (!settings) return NextResponse.json({ error }, { status: 400 });
  store.settings = settings;
  saveStore(store);
  return NextResponse.json({ settings });
}

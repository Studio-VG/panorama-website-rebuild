import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import { locationFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const store = getStore();
  const { location, error } = locationFrom(body);
  if (!location) return NextResponse.json({ error }, { status: 400 });
  store.locations.push(location);
  saveStore(store);
  return NextResponse.json({ location });
}

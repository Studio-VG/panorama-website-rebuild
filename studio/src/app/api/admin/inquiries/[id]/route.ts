import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const store = getStore();
  store.inquiries = store.inquiries.filter((inquiry) => inquiry.id !== id);
  saveStore(store);
  return NextResponse.json({ ok: true });
}

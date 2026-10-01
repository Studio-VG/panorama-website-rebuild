import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/store";
import { inquiryFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { inquiry, error } = inquiryFrom(body);
  if (!inquiry) return NextResponse.json({ error }, { status: 400 });
  const store = getStore();
  store.inquiries.unshift(inquiry);
  saveStore(store);
  return NextResponse.json({ ok: true, id: inquiry.id });
}

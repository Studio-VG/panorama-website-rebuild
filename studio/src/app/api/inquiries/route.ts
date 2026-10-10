import { NextResponse } from "next/server";
import { clientFromRequest } from "@/lib/clients";
import { getStore, saveStore } from "@/lib/store";
import { inquiryFrom } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const client = clientFromRequest(request);
  if (!client?.emailVerified || !client.phoneVerified) {
    return NextResponse.json({ error: "Register and confirm your email and phone first.", code: "register" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { inquiry, error } = inquiryFrom({
    ...(typeof body === "object" && body ? body : {}),
    name: client.name,
    email: client.email,
    phone: client.phone,
  });
  if (!inquiry) return NextResponse.json({ error }, { status: 400 });
  const store = getStore();
  store.inquiries.unshift(inquiry);
  saveStore(store);
  return NextResponse.json({ ok: true, id: inquiry.id });
}

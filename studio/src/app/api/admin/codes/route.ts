import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { codeDelivery, unusedCodes } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const delivery = codeDelivery();
  const deliveryNote = delivery.email || delivery.sms
    ? `Sending is on for ${[delivery.email ? "email" : "", delivery.sms ? "SMS" : ""].filter(Boolean).join(" and ")}. Unused codes that were not sent still appear here.`
    : "Email and SMS are not configured, so these codes were not sent. They stay here until they are used.";
  return NextResponse.json({ codes: unusedCodes(), delivery, deliveryNote });
}

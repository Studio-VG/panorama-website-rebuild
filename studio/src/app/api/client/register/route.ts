import { NextResponse } from "next/server";
import { startRegistration } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await startRegistration(body);
  if ("error" in result) {
    const status = result.error === "send" ? 502 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ id: result.id, delivery: result.delivery, expiresAt: result.expiresAt });
}

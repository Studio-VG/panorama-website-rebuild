import { NextResponse } from "next/server";
import { clientFromRequest } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const client = clientFromRequest(request);
  if (!client) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    name: client.name,
    email: client.email,
    phone: client.phone,
    emailVerified: client.emailVerified,
    phoneVerified: client.phoneVerified,
  });
}

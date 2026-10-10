import { NextResponse } from "next/server";
import { clientCookieHeader, clientSessionToken } from "@/lib/auth";
import { confirmRegistration } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = confirmRegistration(body);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, emailOk: "emailOk" in result ? result.emailOk : false, phoneOk: "phoneOk" in result ? result.phoneOk : false },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { ok: true, name: result.account.name },
    { headers: { "Set-Cookie": clientCookieHeader(clientSessionToken(result.account.id)) } },
  );
}

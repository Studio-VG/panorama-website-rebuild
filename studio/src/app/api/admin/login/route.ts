import { NextResponse } from "next/server";
import { passwordMatches, sessionCookieHeader, sessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = typeof (body as { password?: unknown }).password === "string"
    ? (body as { password: string }).password
    : "";
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionCookieHeader(sessionToken()));
  return response;
}

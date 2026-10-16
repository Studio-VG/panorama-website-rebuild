import { clientCookieHeader, clientSessionToken } from "@/lib/auth";
import { oauthBlockedPage, oauthMissing, oauthRedirect, requestOrigin, safeNext } from "@/lib/oauth";
import { getStore, saveStore } from "@/lib/store";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const redirectUrl = oauthRedirect(origin, "google");
  const missing = oauthMissing("google");
  if (missing.length) return oauthBlockedPage("google", missing, redirectUrl);
  const current = new URL(request.url);
  const code = current.searchParams.get("code") || "";
  if (!code) return oauthBlockedPage("google", ["authorization code from Google"], redirectUrl);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      redirect_uri: redirectUrl,
      grant_type: "authorization_code",
    }),
  });
  const token = await tokenResponse.json().catch(() => ({}));
  const access = typeof token.access_token === "string" ? token.access_token : "";
  if (!access) return oauthBlockedPage("google", ["a valid Google token response"], redirectUrl);
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const profile = await profileResponse.json().catch(() => ({}));
  const email = typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "";
  if (!email || profile.email_verified !== true) {
    return oauthBlockedPage("google", ["a verified Google email"], redirectUrl);
  }
  const name = typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : email.split("@")[0];
  const store = getStore();
  let account = (store.clients || []).find((client) => client.email === email);
  if (account) {
    account.emailVerified = true;
    account.name = name;
  } else {
    account = {
      id: randomUUID(),
      name,
      email,
      phone: "",
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
    };
    store.clients = [account, ...(store.clients || [])];
  }
  saveStore(store);
  const state = current.searchParams.get("state") || "";
  const next = safeNext(Buffer.from(state, "base64url").toString("utf8"));
  return new Response(null, {
    status: 302,
    headers: {
      Location: next,
      "Set-Cookie": clientCookieHeader(clientSessionToken(account.id)),
    },
  });
}

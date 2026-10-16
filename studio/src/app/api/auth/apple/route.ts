import { oauthBlockedPage, oauthMissing, oauthRedirect, requestOrigin, safeNext } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const redirectUrl = oauthRedirect(origin, "apple");
  const missing = oauthMissing("apple");
  if (missing.length) return oauthBlockedPage("apple", missing, redirectUrl);
  const next = safeNext(new URL(request.url).searchParams.get("next"));
  const state = Buffer.from(next).toString("base64url");
  const url = new URL("https://appleid.apple.com/auth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "form_post");
  url.searchParams.set("client_id", process.env.APPLE_SERVICES_ID!.trim());
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("scope", "name email");
  url.searchParams.set("state", state);
  return Response.redirect(url);
}

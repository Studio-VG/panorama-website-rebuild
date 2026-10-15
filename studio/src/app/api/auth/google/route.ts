import { oauthBlockedPage, oauthMissing, oauthRedirect, requestOrigin, safeNext } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const redirectUrl = oauthRedirect(origin, "google");
  const missing = oauthMissing("google");
  if (missing.length) return oauthBlockedPage("google", missing, redirectUrl);
  const next = safeNext(new URL(request.url).searchParams.get("next"));
  const state = Buffer.from(next).toString("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!.trim());
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  return Response.redirect(url);
}

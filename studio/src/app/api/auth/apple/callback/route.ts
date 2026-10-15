import { oauthBlockedPage, oauthMissing, oauthRedirect, requestOrigin } from "@/lib/oauth";

export const dynamic = "force-dynamic";

async function refuse(request: Request) {
  const origin = requestOrigin(request);
  const redirectUrl = oauthRedirect(origin, "apple");
  const missing = oauthMissing("apple");
  return oauthBlockedPage(
    "apple",
    missing.length ? missing : ["a verified Apple identity token. This callback does not sign anyone in until that token is checked."],
    redirectUrl,
  );
}

export async function GET(request: Request) {
  return refuse(request);
}

export async function POST(request: Request) {
  return refuse(request);
}

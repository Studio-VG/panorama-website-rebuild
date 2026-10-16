export type OAuthProvider = "google" | "apple";

function envValue(name: string) {
  return process.env[name]?.trim() || "";
}

export function oauthRedirect(origin: string, provider: OAuthProvider) {
  return `${origin}/api/auth/${provider}/callback`;
}

export function oauthMissing(provider: OAuthProvider) {
  if (provider === "google") {
    return ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"].filter((name) => !envValue(name));
  }
  return ["APPLE_SERVICES_ID", "APPLE_TEAM_ID", "APPLE_KEY_ID", "APPLE_PRIVATE_KEY"].filter((name) => !envValue(name));
}

export function oauthBlockedPage(provider: OAuthProvider, missing: string[], redirectUrl: string) {
  const name = provider === "google" ? "Google" : "Apple";
  const body = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${name} sign-in</title></head><body><main><h1>${name} sign-in is not configured</h1><p>No account was created and nobody was signed in.</p><p>Still needed: ${missing.join(", ")}.</p><p>Redirect URL to allow: ${redirectUrl}</p></main></body></html>`;
  return new Response(body, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export function requestOrigin(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function safeNext(value: string | null) {
  return value && /^\/(ka|en|tr|de|ru)(\/book)?$/.test(value) ? value : "/ka";
}

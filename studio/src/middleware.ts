import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { countryFromHeaders, localeFromIp, publicClientIp } from "@/lib/geo";
import { isBot, isLocale, localeCookie, localeFromCountry, type Locale } from "@/lib/locale";

function withLocaleHeader(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

function remember(response: NextResponse, locale: Locale) {
  response.cookies.set(localeCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

async function preferredLocale(request: NextRequest): Promise<Locale> {
  if (isBot(request.headers.get("user-agent"))) return "en";
  const chosen = request.cookies.get(localeCookie)?.value;
  if (isLocale(chosen)) return chosen;
  const country = countryFromHeaders(request.headers);
  if (country) return localeFromCountry(country);
  if (process.env.NODE_ENV !== "production") return "en";
  const ip = publicClientIp(request.headers);
  if (!ip) return "en";
  return localeFromIp(ip);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/guest") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return withLocaleHeader(request, "en");
  }

  const segment = pathname.split("/")[1];
  if (isLocale(segment)) {
    if (request.nextUrl.searchParams.get("choose") === "1" && !isBot(request.headers.get("user-agent"))) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("choose");
      return remember(NextResponse.redirect(url), segment);
    }
    return withLocaleHeader(request, segment);
  }

  const locale = await preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

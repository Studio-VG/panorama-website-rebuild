import { localeFromCountry, type Locale } from "./locale";

function isPrivateIp(ip: string) {
  return (
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

export function countryFromHeaders(headers: { get(name: string): string | null }) {
  return headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry");
}

export function publicClientIp(headers: { get(name: string): string | null }) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers.get("x-real-ip")?.trim() || "";
  if (!ip || isPrivateIp(ip)) return null;
  return ip;
}

export async function localeFromIp(ip: string): Promise<Locale> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 800);
    const response = await fetch(`https://get.geojs.io/v1/ip/country/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!response.ok) return "en";
    const code = (await response.text()).trim();
    if (!/^[A-Za-z]{2}$/.test(code)) return "en";
    return localeFromCountry(code);
  } catch {
    return "en";
  }
}

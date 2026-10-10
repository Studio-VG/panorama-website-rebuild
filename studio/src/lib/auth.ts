import { createHmac, timingSafeEqual } from "crypto";
import type { Artist } from "./types";

export const ADMIN_COOKIE = "studio_admin";

export function adminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  return fromEnv || "byvaso-demo";
}

export function passwordMatches(input: string) {
  const expected = adminPassword();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sessionToken() {
  const password = adminPassword();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || password;
  return createHmac("sha256", secret).update(`admin:${password}`).digest("hex");
}

export function isAuthed(cookieValue: string | undefined) {
  if (!cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(sessionToken());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function readCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const parts = header.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function sessionCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}${secure}`;
}

export function clearCookieHeader() {
  return `${ADMIN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function requireAdmin(request: Request) {
  return isAuthed(readCookie(request.headers.get("cookie"), ADMIN_COOKIE));
}

export const GUEST_COOKIE = "studio_guest";

export function guestSessionToken(id: string, password: string) {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword();
  const sig = createHmac("sha256", secret).update(`guest:${id}:${password}`).digest("hex");
  return `${id}.${sig}`;
}

export function guestCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${GUEST_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 14}${secure}`;
}

export function clearGuestCookieHeader() {
  return `${GUEST_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function guestFromToken(token: string | undefined, artists: Artist[]) {
  if (!token || !token.includes(".")) return null;
  const id = token.slice(0, token.indexOf("."));
  const artist = artists.find((item) => item.id === id && item.role === "guest" && item.portalPassword);
  if (!artist?.portalPassword) return null;
  const expected = guestSessionToken(artist.id, artist.portalPassword);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? artist : null;
}

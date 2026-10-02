import type { HoursEntry, StudioEvent } from "./types";

const dateLocales: Record<string, string> = { en: "en-GB", tr: "tr-TR", de: "de-DE", ru: "ru-RU" };

export function formatRange(start: string, end?: string, lang = "en") {
  if (!start) return "";
  const startDate = new Date(`${start}T12:00:00Z`);
  const finish = end || start;
  const endDate = new Date(`${finish}T12:00:00Z`);
  const full = new Intl.DateTimeFormat(dateLocales[lang] || "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  if (start === finish) return full.format(startDate);
  const sameMonth =
    startDate.getUTCFullYear() === endDate.getUTCFullYear() &&
    startDate.getUTCMonth() === endDate.getUTCMonth();
  if (sameMonth) return `${startDate.getUTCDate()}–${full.format(endDate)}`;
  return `${full.format(startDate)} – ${full.format(endDate)}`;
}

export function eventStatus(event: StudioEvent, today = new Date()) {
  const current = today.toISOString().slice(0, 10);
  const end = event.endDate || event.startDate;
  if (!event.startDate) return "Dated in admin";
  if (current < event.startDate) return "Upcoming";
  if (current > end) return "Past";
  return "Now";
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function parseHours(entry: HoursEntry) {
  if (/closed/i.test(entry.hours)) return null;
  const match = entry.hours.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  return { opens: match[1], closes: match[2] };
}

export function slugify(input: string) {
  const map: Record<string, string> = {
    ı: "i",
    İ: "i",
    ş: "s",
    Ş: "s",
    ğ: "g",
    Ğ: "g",
    ü: "u",
    Ü: "u",
    ö: "o",
    Ö: "o",
    ç: "c",
    Ç: "c",
  };
  const replaced = input
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
  const slug = replaced
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "artist";
}

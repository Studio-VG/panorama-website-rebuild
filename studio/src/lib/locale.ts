export const locales = ["en", "tr", "de", "ru", "ka"] as const;
export type Locale = (typeof locales)[number];

export const localeCookie = "studio_lang";

const countryLocale: Record<string, Locale> = {
  TR: "tr",
  RU: "ru",
  DE: "de",
  GE: "ka",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localeFromCountry(code: string | null | undefined): Locale {
  if (!code) return "en";
  return countryLocale[code.trim().toUpperCase()] || "en";
}

export function isBot(userAgent: string | null) {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|pinterest|whatsapp|telegrambot|google-inspectiontool|mediapartners|adsbot|applebot|petalbot|bytespider|gptbot|claudebot|amazonbot/i.test(userAgent);
}

export function switchLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = next;
  else parts.splice(1, 0, next);
  return `${parts.join("/") || `/${next}`}?choose=1`;
}

export function htmlLang(locale: Locale) {
  return locale;
}

export function openGraphLocale(locale: Locale) {
  return { en: "en_US", tr: "tr_TR", de: "de_DE", ru: "ru_RU", ka: "ka_GE" }[locale];
}

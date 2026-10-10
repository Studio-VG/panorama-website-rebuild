import type { Location } from "./types";

export const ISTANBUL_LOCATION: Location = {
  id: "loc-istanbul",
  name: "Istanbul",
  address: "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye",
  mapsUrl: "https://maps.app.goo.gl/peS5AiSXgxieLkbs7",
  mapQuery: "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul",
};

export type ServiceGroup = {
  key: string;
  label: string;
  venues: string[];
};

const CITY_WORDS = [
  ["dusseldorf", ["düsseldorf", "dusseldorf", "duesseldorf", "дюссельдорф"]],
  ["istanbul", ["istanbul", "i̇stanbul", "ıstanbul", "стамбул"]],
] as const;

const COUNTRY_WORDS = ["germany", "deutschland", "almanya", "германия", "turkey", "türkei", "türkiye", "турция"];

function fold(value: string) {
  return value
    .toLocaleLowerCase("en")
    .replaceAll("i̇", "i")
    .replaceAll("ı", "i")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ä", "a")
    .replaceAll("ß", "ss");
}

function cityKey(place: Location) {
  const hay = fold(`${place.address} ${place.name}`);
  for (const [key, words] of CITY_WORDS) {
    if (words.some((word) => hay.includes(fold(word)))) return key;
  }
  return "";
}

function isCityOrCountry(value: string) {
  const folded = fold(value.trim());
  if (!folded) return true;
  if (COUNTRY_WORDS.some((word) => folded === fold(word))) return true;
  return CITY_WORDS.some(([, words]) => words.some((word) => folded === fold(word)));
}

function venueLabel(name: string) {
  const trimmed = name.trim();
  if (isCityOrCountry(trimmed)) return "";
  let label = trimmed.replace(/\s+[-–—]\s+.*$/, "");
  label = label.replace(/\s+by\s+\S+$/i, "");
  label = label.replace(/\b(düsseldorf|dusseldorf|duesseldorf|istanbul|i̇stanbul|ıstanbul|germany|deutschland|almanya|türkiye|turkey|türkei)\b/gi, "");
  label = label.replace(/\s+/g, " ").trim().replace(/^[,.\-–—]+|[,.\-–—]+$/g, "");
  label = label.replace(/\s+hotel$/i, "").trim();
  return isCityOrCountry(label) ? "" : label;
}

export function serviceGroups(locations: Location[], labels: { istanbul: string; dusseldorf: string }): ServiceGroup[] {
  const known = { istanbul: labels.istanbul, dusseldorf: labels.dusseldorf };
  const groups: ServiceGroup[] = [];
  const index = new Map<string, ServiceGroup>();
  for (const place of locations) {
    const key = cityKey(place);
    const label = key === "istanbul" || key === "dusseldorf" ? known[key] : place.name.trim();
    if (!key && isCityOrCountry(label)) continue;
    const groupKey = key || fold(label);
    let group = index.get(groupKey);
    if (!group) {
      group = { key: groupKey, label, venues: [] };
      index.set(groupKey, group);
      groups.push(group);
    }
    if (key) {
      const venue = venueLabel(place.name);
      if (venue && !group.venues.includes(venue)) group.venues.push(venue);
    }
  }
  return groups;
}

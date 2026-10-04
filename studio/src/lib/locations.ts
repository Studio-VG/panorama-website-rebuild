import type { Location } from "./types";

export const ISTANBUL_LOCATION: Location = {
  id: "loc-istanbul",
  name: "Istanbul",
  address: "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye",
  mapsUrl: "https://maps.app.goo.gl/peS5AiSXgxieLkbs7",
  mapQuery: "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul",
};

export function serviceNames(locations: Location[], germanyLabel: string) {
  const names = locations.map((place) => place.name.trim()).filter(Boolean);
  const replaced = names.some((name) => {
    const value = name.toLocaleLowerCase();
    return value === germanyLabel.trim().toLocaleLowerCase() || value === "germany";
  });
  return replaced ? names : [...names, germanyLabel];
}

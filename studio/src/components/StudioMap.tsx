const STUDIO_ADDRESS = "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye";
export const STUDIO_ADDRESS_FULL = "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye";
export const STUDIO_MAPS_LINK = "https://maps.app.goo.gl/peS5AiSXgxieLkbs7";
const STUDIO_MAP_QUERY = "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul";

export function studioMapSrc(query = STUDIO_MAP_QUERY) {
  const params = new URLSearchParams({
    q: query.trim() || STUDIO_MAP_QUERY,
    z: "19",
    hl: "en",
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

export function StudioMap({
  address = STUDIO_ADDRESS,
  mapQuery = STUDIO_MAP_QUERY,
  className = "map-frame map-compact",
}: {
  address?: string;
  mapQuery?: string;
  className?: string;
}) {
  const place = address.trim() || STUDIO_ADDRESS;
  return (
    <iframe
      className={className}
      title={place}
      src={studioMapSrc(mapQuery)}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

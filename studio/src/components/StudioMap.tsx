const STUDIO_ADDRESS = "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye";
export const STUDIO_ADDRESS_FULL = "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye";
export const STUDIO_MAPS_LINK = "https://maps.app.goo.gl/peS5AiSXgxieLkbs7";
const STUDIO_MAP_QUERY = "Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul";

export function studioMapSrc() {
  const query = new URLSearchParams({
    q: STUDIO_MAP_QUERY,
    z: "19",
    hl: "en",
    output: "embed",
  });
  return `https://maps.google.com/maps?${query.toString()}`;
}

export function StudioMap({ address = STUDIO_ADDRESS, className = "map-frame map-compact" }: { address?: string; className?: string }) {
  const place = address.trim() || STUDIO_ADDRESS;
  return (
    <iframe
      className={className}
      title={place}
      src={studioMapSrc()}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

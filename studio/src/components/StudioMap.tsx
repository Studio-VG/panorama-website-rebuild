const STUDIO_ADDRESS = "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye";
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

export function StudioMap({ address = STUDIO_ADDRESS }: { address?: string }) {
  const place = address.trim() || STUDIO_ADDRESS;
  return (
    <iframe
      className="map-frame map-compact"
      title={place}
      src={studioMapSrc()}
      width={260}
      height={160}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

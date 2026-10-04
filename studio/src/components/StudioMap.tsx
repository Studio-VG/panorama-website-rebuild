const STUDIO_ADDRESS = "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye";
const STUDIO_MAP_SHARE = "https://share.google/Q8HK91VK6P6WKsPhe";

export function studioMapSrc(address = STUDIO_ADDRESS) {
  const place = address.trim() || STUDIO_ADDRESS;
  const query = new URLSearchParams({
    q: place,
    z: "16",
    output: "embed",
    share: STUDIO_MAP_SHARE,
  });
  return `https://maps.google.com/maps?${query.toString()}`;
}

export function StudioMap({ address = STUDIO_ADDRESS }: { address?: string }) {
  const place = address.trim() || STUDIO_ADDRESS;
  return (
    <iframe
      className="map-frame map-compact"
      title={place}
      src={studioMapSrc(place)}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

const STUDIO_ADDRESS = "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye";

export function studioMapSrc(address = STUDIO_ADDRESS) {
  const place = address.trim() || STUDIO_ADDRESS;
  const query = new URLSearchParams({
    q: place,
    z: "17",
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
      src={studioMapSrc(place)}
      width={260}
      height={160}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

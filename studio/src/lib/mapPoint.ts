const points = new Map<string, { lat: number; lng: number }>();

export async function mapPoint(query: string) {
  const key = query.trim();
  if (!key) return null;
  const cached = points.get(key);
  if (cached) return cached;
  try {
    const url = `https://maps.google.com/maps?${new URLSearchParams({ q: key, z: "19", hl: "en", output: "embed" })}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000), headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) return null;
    const html = await response.text();
    const point = pointFromEmbed(html);
    if (point) points.set(key, point);
    return point;
  } catch {
    return null;
  }
}

export function pointFromEmbed(html: string) {
  for (const match of html.matchAll(/\[(-?\d+\.\d+),(-?\d+\.\d+)\]/g)) {
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

export function darkMapDocument(lat: number, lng: number, zoom = 15) {
  const safeLat = Number(lat);
  const safeLng = Number(lng);
  const safeZoom = Number.isFinite(zoom) ? Math.min(18, Math.max(12, zoom)) : 15;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
<style>
  html,body,#m{margin:0;height:100%;background:#1c1c1c}
  .pin{width:14px;height:14px;background:#e24b3b;border:2px solid #fff;border-radius:50%;box-sizing:border-box}
</style>
</head>
<body>
<div id="m"></div>
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<script>
const lat=${safeLat}, lng=${safeLng};
const map=new maplibregl.Map({
  container:"m",
  style:"https://tiles.openfreemap.org/styles/dark",
  center:[lng, lat],
  zoom:${safeZoom}
});
map.on("load",()=>map.resize());
const pin=document.createElement("div");
pin.className="pin";
new maplibregl.Marker({element:pin}).setLngLat([lng, lat]).addTo(map);
</script>
</body>
</html>`;
}

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
  const safeZoom = Number.isFinite(zoom) ? Math.min(18, Math.max(12, Math.round(zoom))) : 15;
  return `<!doctype html>
<meta charset="utf-8">
<style>
  html,body{margin:0;height:100%;background:#2b2b2b;overflow:hidden}
  img{position:absolute;width:256px;height:256px}
  .pin{position:absolute;left:50%;top:50%;z-index:3;width:14px;height:14px;margin:-7px 0 0 -7px;background:#e24b3b;border:2px solid #fff;border-radius:50%;box-sizing:border-box}
  .credit{position:absolute;right:4px;bottom:2px;z-index:4;color:#c8c8c8;font:9px/1.2 sans-serif;text-shadow:0 1px 2px #000}
</style>
<div id="root"></div>
<div class="pin"></div>
<div class="credit">© Esri</div>
<script>
const lat=${safeLat}, lng=${safeLng}, z=${safeZoom};
function world(lat,lng,z){
  const n=2**z;
  const x=(lng+180)/360*n;
  const s=Math.sin(lat*Math.PI/180);
  const y=(1-Math.log((1+s)/(1-s))/(2*Math.PI))/2*n;
  return [x,y];
}
function draw(){
  const w=document.documentElement.clientWidth||320;
  const h=document.documentElement.clientHeight||210;
  const [fx,fy]=world(lat,lng,z);
  const left=w/2-fx*256;
  const top=h/2-fy*256;
  const root=document.getElementById("root");
  root.replaceChildren();
  const n=2**z;
  const layers=["World_Dark_Gray_Base","World_Dark_Gray_Reference"];
  for(let x=Math.floor(-left/256)-1;x<=Math.ceil((w-left)/256)+1;x++){
    for(let y=Math.floor(-top/256)-1;y<=Math.ceil((h-top)/256)+1;y++){
      if(x<0||y<0||x>=n||y>=n) continue;
      for(const layer of layers){
        const img=document.createElement("img");
        img.alt="";
        img.src="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/"+layer+"/MapServer/tile/"+z+"/"+y+"/"+x;
        img.style.left=(left+x*256)+"px";
        img.style.top=(top+y*256)+"px";
        root.appendChild(img);
      }
    }
  }
}
draw();
addEventListener("resize", draw);
</script>`;
}

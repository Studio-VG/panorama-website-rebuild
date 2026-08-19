/** Works on localhost (`/`) and GitHub Pages (`/panorama-website-rebuild/`). */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
}

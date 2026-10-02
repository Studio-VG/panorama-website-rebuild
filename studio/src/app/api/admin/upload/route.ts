import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  if (file.size > 5_000_000) return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  if (!allowed.has(file.type) || !extensions.has(ext)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or SVG." }, { status: 400 });
  }
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(process.cwd(), "data", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/media/${filename}` });
}

import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, rename, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore, saveStore } from "@/lib/store";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

const welcomeVideoMaxBytes = 42 * 1024 * 1024;
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);
function isMp4(bytes: Buffer) {
  return bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
}

function safeVideoName(name: string) {
  const base = path.basename(name).replace(/[^\w.\- ]+/g, "").slice(0, 180);
  return base.toLowerCase().endsWith(".mp4") ? base : `${base || "welcome"}.mp4`;
}

function writeFaststartCopy(file: string) {
  const fast = file.replace(/\.mp4$/, ".faststart.mp4");
  if (fast === file) return Promise.resolve();
  const tmp = `${fast}.tmp`;
  return new Promise<void>((resolve) => {
    execFile("ffmpeg", ["-y", "-i", file, "-c", "copy", "-movflags", "+faststart", tmp], { timeout: 120000 }, (error) => {
      if (error) {
        resolve();
        return;
      }
      rename(tmp, fast).then(() => resolve(), () => resolve());
    });
  });
}

function playingWelcomeFile(settings: Settings) {
  for (const candidate of [settings.welcomeVideo, settings.vasoHomeVideo]) {
    const match = /^\/api\/media\/([\w.-]+\.mp4)$/.exec((candidate ?? "").split("?")[0]);
    if (!match) continue;
    const file = path.join(process.cwd(), "data", "uploads", match[1]);
    if (existsSync(file)) return match[1];
  }
  return "";
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  const video = String(form.get("kind") || "") === "video";
  if (video) {
    if (file.size > welcomeVideoMaxBytes) return NextResponse.json({ error: "Video must be 42 MB or smaller." }, { status: 400 });
    if (ext !== ".mp4") return NextResponse.json({ error: "Use an mp4." }, { status: 400 });
  } else if (file.size > 5_000_000) {
    return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  } else if (!allowed.has(file.type) || !extensions.has(ext)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or SVG." }, { status: 400 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (video && (ext !== ".mp4" || !isMp4(bytes))) {
    return NextResponse.json({ error: "Use an mp4." }, { status: 400 });
  }
  const playing = video ? playingWelcomeFile(getStore().settings) : "";
  const filename = playing || `${Date.now()}-${randomUUID().slice(0, 8)}${video ? ".mp4" : ext}`;
  const dir = path.join(process.cwd(), "data", "uploads");
  await mkdir(dir, { recursive: true });
  const stored = path.join(dir, filename);
  await writeFile(stored, bytes);
  if (video) await writeFaststartCopy(stored);
  const url = `/api/media/${filename}`;
  if (video) {
    const store = getStore();
    const name = safeVideoName(file.name);
    store.settings = { ...store.settings, welcomeVideo: url, welcomeVideoName: name };
    saveStore(store);
    return NextResponse.json({ url, name });
  }
  return NextResponse.json({ url });
}

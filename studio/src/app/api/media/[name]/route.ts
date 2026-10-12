import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

export async function GET(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  if (!/^[\w.-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  const file = path.join(process.cwd(), "data", "uploads", name);
  let size = 0;
  try {
    size = statSync(file).size;
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = path.extname(name).toLowerCase();
  const type = types[ext] || "application/octet-stream";
  const range = request.headers.get("range");
  let start = 0;
  let end = size - 1;
  let status = 200;
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (!match) return new NextResponse("Bad range", { status: 416 });
    if (match[1] === "" && match[2] !== "") {
      const suffix = Number(match[2]);
      start = suffix > 0 ? Math.max(0, size - suffix) : 0;
    } else {
      start = match[1] === "" ? 0 : Number(match[1]);
      end = match[2] === "" ? size - 1 : Number(match[2]);
    }
    if (start > end || start >= size) {
      return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    end = Math.min(end, size - 1);
    status = 206;
  }
  const headers = new Headers({
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  if (status === 206) headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  const stream = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
  return new Response(stream, { status, headers });
}

import { readFile } from "fs/promises";
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
};

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  if (!/^[\w.-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  const file = path.join(process.cwd(), "data", "uploads", name);
  try {
    const data = await readFile(file);
    const ext = path.extname(name).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { CATALOG } from "./src/data/catalog";
import { TIKTOK_VIDEOS } from "./src/data/tiktok";
import type { SystemListing } from "./src/types";

interface Inquiry {
  id: string;
  referenceNumber: string;
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  city: string;
  message?: string;
  dimensions?: { width?: number; height?: number; area?: number };
  preferredContact: string;
  language: string;
  createdAt: string;
}

interface TikTokVideoItem {
  id: number;
  thumbnail: string;
  url: string;
  title: { ka: string; en: string; ru: string };
}

const DATA_DIR = path.join(process.cwd(), "user_data");
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");
const TIKTOK_FILE = path.join(DATA_DIR, "tiktok.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const MAX_STORED_INQUIRIES = 1000;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Every write below goes through the *_FILE path in user_data/, which is
 * NOT committed to source control and does not survive a redeploy on most
 * hosts (this was the root cause of photos repeatedly "disappearing" in
 * the previous build). The images this site actually needs to show are
 * committed under /public instead (see src/data/catalog.ts and
 * src/data/tiktok.ts) - these JSON files only hold optional admin
 * overrides layered on top of that committed baseline.
 */
function loadSavedListings(): SystemListing[] {
  try {
    ensureDataDir();
    if (fs.existsSync(LISTINGS_FILE)) {
      const raw = fs.readFileSync(LISTINGS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === CATALOG.length) {
        // Merge against the committed catalog by id so a partial/older
        // override file can never drop a field the frontend expects.
        const overrides = parsed as Partial<SystemListing>[];
        return CATALOG.map((base) => {
          const override = overrides.find((p) => p.id === base.id);
          return override ? { ...base, ...override } : base;
        });
      }
    }
  } catch (err) {
    console.error("[PANORAMA] Error reading listings override file:", err);
  }
  return CATALOG;
}

function saveListingsToFile(listings: SystemListing[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2), "utf-8");
  } catch (err) {
    console.error("[PANORAMA] Error saving listings override file:", err);
  }
}

function loadSavedTikTokVideos(): TikTokVideoItem[] {
  try {
    ensureDataDir();
    if (fs.existsSync(TIKTOK_FILE)) {
      const raw = fs.readFileSync(TIKTOK_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("[PANORAMA] Error reading tiktok override file:", err);
  }
  return TIKTOK_VIDEOS;
}

function saveTikTokToFile(videos: TikTokVideoItem[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(TIKTOK_FILE, JSON.stringify(videos, null, 2), "utf-8");
  } catch (err) {
    console.error("[PANORAMA] Error saving tiktok override file:", err);
  }
}

function loadInquiries(): Inquiry[] {
  try {
    ensureDataDir();
    if (fs.existsSync(INQUIRIES_FILE)) {
      const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("[PANORAMA] Error reading inquiries file:", err);
  }
  return [];
}

function saveInquiries(list: Inquiry[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list.slice(0, MAX_STORED_INQUIRIES), null, 2), "utf-8");
  } catch (err) {
    console.error("[PANORAMA] Error saving inquiries file:", err);
  }
}

async function notifyWebhook(inquiry: Inquiry) {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error("[PANORAMA] Inquiry webhook notification failed:", err);
  }
}

let activeListings: SystemListing[] = loadSavedListings();
let activeTikTokVideos: TikTokVideoItem[] = loadSavedTikTokVideos();
let inquiries: Inquiry[] = loadInquiries();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));
  app.use(express.static(path.join(process.cwd(), "public")));

  /**
   * Admin-only gate for every endpoint that writes data. Requests must
   * send header `x-admin-key` matching the ADMIN_API_KEY environment
   * variable. If ADMIN_API_KEY isn't set at all, these routes are
   * disabled outright rather than silently left open - a previous
   * version of this site had an unauthenticated public "change photo"
   * button that anyone visiting the site could use, which is what this
   * replaces.
   */
  function requireAdminKey(req: Request, res: Response, next: NextFunction) {
    const configuredKey = process.env.ADMIN_API_KEY;
    if (!configuredKey) {
      return res.status(503).json({ success: false, error: "Admin API is not configured on this server (ADMIN_API_KEY unset)." });
    }
    const providedKey = req.headers["x-admin-key"];
    if (providedKey !== configuredKey) {
      return res.status(401).json({ success: false, error: "Invalid or missing x-admin-key header." });
    }
    next();
  }

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", app: "Panorama Architectural Systems", time: new Date().toISOString() });
  });

  // ---- Public read endpoints ----

  app.get("/api/listings", (_req: Request, res: Response) => {
    res.json({ success: true, listings: activeListings });
  });

  app.get("/api/tiktok", (_req: Request, res: Response) => {
    res.json({ success: true, videos: activeTikTokVideos });
  });

  // ---- Admin-gated write endpoints ----

  app.post("/api/listings", requireAdminKey, (req: Request, res: Response) => {
    try {
      const { listings } = req.body;
      if (!Array.isArray(listings) || listings.length !== CATALOG.length) {
        return res.status(400).json({ success: false, error: `Must provide exactly ${CATALOG.length} listings.` });
      }
      activeListings = CATALOG.map((base) => {
        const override = listings.find((p: any) => p.id === base.id);
        return override ? { ...base, ...override } : base;
      });
      saveListingsToFile(activeListings);
      return res.json({ success: true, listings: activeListings });
    } catch (err) {
      console.error("[PANORAMA API] Error saving listings:", err);
      return res.status(500).json({ success: false, error: "Failed to save listings" });
    }
  });

  app.post("/api/tiktok", requireAdminKey, (req: Request, res: Response) => {
    try {
      const { videos } = req.body;
      if (!Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid tiktok video list" });
      }
      activeTikTokVideos = videos;
      saveTikTokToFile(activeTikTokVideos);
      return res.json({ success: true, videos: activeTikTokVideos });
    } catch (err) {
      console.error("[PANORAMA API] Error saving tiktok:", err);
      return res.status(500).json({ success: false, error: "Failed to save tiktok videos" });
    }
  });

  // Replace one listing's photo, or one TikTok thumbnail. Body:
  // { base64, targetSlot: 1-6 } for a listing, or { base64, targetId: "tiktok-1"|"tiktok-2"|"tiktok-3" }.
  app.post("/api/upload-image", requireAdminKey, (req: Request, res: Response) => {
    try {
      const { base64, targetSlot, targetId } = req.body;
      if (!base64) {
        return res.status(400).json({ success: false, error: "Missing base64 image data" });
      }
      const cleanBase64 = String(base64).replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      const timestamp = Date.now();

      const slot = targetSlot ? Number(targetSlot) : null;
      if (slot && slot >= 1 && slot <= CATALOG.length) {
        const listingsDir = path.join(process.cwd(), "public", "user-listings");
        if (!fs.existsSync(listingsDir)) fs.mkdirSync(listingsDir, { recursive: true });
        const filename = `slot-${slot}.jpg`;
        fs.writeFileSync(path.join(listingsDir, filename), buffer);
        const savedUrl = `/user-listings/${filename}?t=${timestamp}`;
        const idx = activeListings.findIndex((l) => l.slotNumber === slot);
        if (idx >= 0) activeListings[idx] = { ...activeListings[idx], image: savedUrl };
        saveListingsToFile(activeListings);
        return res.json({ success: true, savedUrl, listings: activeListings });
      }

      const tiktokMatch = String(targetId || "").match(/^tiktok-(\d)$/);
      if (tiktokMatch) {
        const videoId = Number(tiktokMatch[1]);
        const tiktokDir = path.join(process.cwd(), "public", "tiktok");
        if (!fs.existsSync(tiktokDir)) fs.mkdirSync(tiktokDir, { recursive: true });
        const filename = `video-${videoId}.jpg`;
        fs.writeFileSync(path.join(tiktokDir, filename), buffer);
        const savedUrl = `/tiktok/${filename}?t=${timestamp}`;
        const idx = activeTikTokVideos.findIndex((v) => v.id === videoId);
        if (idx >= 0) activeTikTokVideos[idx] = { ...activeTikTokVideos[idx], thumbnail: savedUrl };
        saveTikTokToFile(activeTikTokVideos);
        return res.json({ success: true, savedUrl, videos: activeTikTokVideos });
      }

      return res.status(400).json({ success: false, error: "Provide a valid targetSlot (1-6) or targetId (tiktok-1..3)." });
    } catch (err) {
      console.error("[PANORAMA API] Error uploading image:", err);
      return res.status(500).json({ success: false, error: "Failed to upload image" });
    }
  });

  app.get("/api/inquiries", requireAdminKey, (_req: Request, res: Response) => {
    res.json({ success: true, count: inquiries.length, data: inquiries });
  });

  // ---- Public write endpoint: the contact / quote form ----

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const {
        name,
        phone,
        email,
        serviceType,
        city,
        message,
        width,
        height,
        preferredContact = "phone",
        language = "ka",
      } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Name is required / \u10e1\u10d0\u10ee\u10d4\u10da\u10d8 \u10e1\u10d0\u10d5\u10d0\u10da\u10d3\u10d4\u10d1\u10e3\u10da\u10dd\u10d0 / \u0418\u043c\u044f \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e",
        });
      }
      if (!phone || typeof phone !== "string" || phone.trim().length < 6) {
        return res.status(400).json({
          success: false,
          error: "Valid phone number is required / \u10e2\u10d4\u10da\u10d4\u10e4\u10dd\u10dc\u10d8\u10e1 \u10dc\u10dd\u10db\u10d4\u10e0\u10d8 \u10e1\u10d0\u10d5\u10d0\u10da\u10d3\u10d4\u10d1\u10e3\u10da\u10dd\u10d0 / \u0422\u0435\u043b\u0435\u0444\u043e\u043d \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u0435\u043d",
        });
      }

      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const referenceNumber = `PAN-${randomDigits}`;
      const area = width && height ? Math.round(Number(width) * Number(height) * 10) / 10 : undefined;

      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        referenceNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: email ? String(email).trim() : undefined,
        serviceType: serviceType || "general_inquiry",
        city: city || "Tbilisi",
        message: message ? String(message).trim() : undefined,
        dimensions: width || height ? { width, height, area } : undefined,
        preferredContact,
        language,
        createdAt: new Date().toISOString(),
      };

      inquiries.unshift(newInquiry);
      saveInquiries(inquiries);
      notifyWebhook(newInquiry); // fire-and-forget; the inquiry is already saved to disk regardless of outcome

      console.log(`[PANORAMA API] New inquiry: ${referenceNumber} from ${newInquiry.name} (${newInquiry.phone}) - ${newInquiry.serviceType}`);

      return res.status(201).json({
        success: true,
        referenceNumber,
        message: "Inquiry registered successfully. An architectural engineer will contact you shortly.",
        details: {
          referenceNumber,
          name: newInquiry.name,
          phone: newInquiry.phone,
          serviceType: newInquiry.serviceType,
          city: newInquiry.city,
          estimatedResponseTime: "Within 2 business hours (10:00 - 19:00 GET)",
          hotline: "+995 599 58 58 59",
          whatsapp: "+995 599 58 58 59",
          showroomAddress: "Varlam Cherkezishvili Street N6, Tbilisi, Georgia",
        },
      });
    } catch (err) {
      console.error("[PANORAMA API] Error handling contact submission:", err);
      return res.status(500).json({ success: false, error: "Internal server error occurred while processing inquiry." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Panorama Server running on http://0.0.0.0:${PORT}`);
    if (!process.env.ADMIN_API_KEY) {
      console.warn("[PANORAMA] ADMIN_API_KEY is not set - admin write endpoints (/api/listings POST, /api/tiktok POST, /api/upload-image) are disabled.");
    }
  });
}

startServer();

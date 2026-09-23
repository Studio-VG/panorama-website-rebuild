import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { parseLeadInput, parseStatusNotes, type Lead } from "./src/crm/model";
import { SEED_LEADS } from "./src/data/seedLeads";

const DATA_DIR = path.join(process.cwd(), "user_data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function sortLeads(list: Lead[]): Lead[] {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.fullName.localeCompare(b.fullName));
}

function loadLeads(): Lead[] {
  ensureDataDir();
  if (!fs.existsSync(LEADS_FILE)) {
    const seeded = sortLeads(SEED_LEADS);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(seeded, null, 2), "utf-8");
    return seeded;
  }
  const raw = fs.readFileSync(LEADS_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("user_data/leads.json must contain an array.");
  }
  return sortLeads(parsed as Lead[]);
}

let leads: Lead[] = loadLeads();

function persist(next: Lead[]) {
  const sorted = sortLeads(next);
  ensureDataDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(sorted, null, 2), "utf-8");
  leads = sorted;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", app: "Advisor CRM" });
  });

  app.get("/api/leads", (_req: Request, res: Response) => {
    res.json({ leads });
  });

  app.get("/api/leads/:id", (req: Request, res: Response) => {
    const lead = leads.find((item) => item.id === req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found." });
    return res.json({ lead });
  });

  app.post("/api/leads", (req: Request, res: Response) => {
    const parsed = parseLeadInput(req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const lead: Lead = {
      id: crypto.randomUUID(),
      ...parsed.value,
      createdAt: new Date().toISOString(),
    };
    persist([lead, ...leads]);
    return res.status(201).json({ lead });
  });

  app.put("/api/leads/:id", (req: Request, res: Response) => {
    const index = leads.findIndex((item) => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: "Lead not found." });
    const parsed = parseLeadInput(req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const updated: Lead = {
      ...leads[index],
      ...parsed.value,
      id: leads[index].id,
      createdAt: leads[index].createdAt,
    };
    const next = leads.slice();
    next[index] = updated;
    persist(next);
    return res.json({ lead: updated });
  });

  app.patch("/api/leads/:id", (req: Request, res: Response) => {
    const index = leads.findIndex((item) => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: "Lead not found." });
    const parsed = parseStatusNotes(req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const updated: Lead = { ...leads[index], status: parsed.value.status, notes: parsed.value.notes };
    const next = leads.slice();
    next[index] = updated;
    persist(next);
    return res.json({ lead: updated });
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
    console.log(`Advisor CRM running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Advisor CRM] Failed to start:", err);
  process.exit(1);
});

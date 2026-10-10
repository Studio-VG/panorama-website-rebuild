import { createHmac, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { clientFromToken } from "./auth";
import { adminPassword } from "./auth";
import { getStore, saveStore } from "./store";
import type { ClientAccount, PendingRegistration } from "./types";

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export type CodeDelivery = { email: boolean; sms: boolean };

function codeSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword();
}

export function codeDelivery(): CodeDelivery {
  const email = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
  const sms = Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim()
    && process.env.TWILIO_AUTH_TOKEN?.trim()
    && process.env.TWILIO_FROM?.trim(),
  );
  return { email, sms };
}

function hashCode(id: string, channel: "email" | "phone", code: string) {
  return createHmac("sha256", codeSecret()).update(`${id}:${channel}:${code}`).digest("hex");
}

function codesMatch(expectedHash: string, id: string, channel: "email" | "phone", code: string) {
  const given = code.trim();
  if (!/^\d{6}$/.test(given)) return false;
  const actual = hashCode(id, channel, given);
  const a = Buffer.from(expectedHash);
  const b = Buffer.from(actual);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function digits(phone: string) {
  return phone.replace(/\D/g, "");
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function dispatchCodes(pending: PendingRegistration, emailCode: string, phoneCode: string) {
  const delivery = codeDelivery();
  if (delivery.email) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY?.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM?.trim(),
        to: pending.email,
        subject: "ByVasoVasiko registration code",
        text: `Your email code is ${emailCode}. It expires in 10 minutes.`,
      }),
    });
    if (!response.ok) throw new Error("email-send-failed");
  }
  if (delivery.sms) {
    const body = new URLSearchParams({
      To: pending.phone,
      From: process.env.TWILIO_FROM?.trim() || "",
      Body: `ByVasoVasiko phone code: ${phoneCode}. It expires in 10 minutes.`,
    });
    const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const token = process.env.TWILIO_AUTH_TOKEN?.trim();
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!response.ok) throw new Error("sms-send-failed");
  }
  return delivery;
}

export async function startRegistration(body: unknown) {
  const input = (body ?? {}) as { name?: unknown; email?: unknown; phone?: unknown };
  const name = text(input.name, 120);
  const email = text(input.email, 160).toLowerCase();
  const phone = text(input.phone, 40);
  if (name.length < 2) return { error: "name" as const };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "email" as const };
  if (digits(phone).length < 6) return { error: "phone" as const };

  const store = getStore();
  const existing = (store.clients || []).find((client) => client.email === email);
  if (existing && digits(existing.phone) !== digits(phone)) return { error: "mismatch" as const };

  const id = randomUUID();
  const emailCode = newCode();
  const phoneCode = newCode();
  const pending: PendingRegistration = {
    id,
    name: existing?.name || name,
    email,
    phone: existing?.phone || phone,
    accountId: existing?.id,
    emailCodeHash: hashCode(id, "email", emailCode),
    phoneCodeHash: hashCode(id, "phone", phoneCode),
    emailCode,
    phoneCode,
    emailVerified: false,
    phoneVerified: false,
    attempts: 0,
    expiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  };

  let delivery: CodeDelivery;
  try {
    delivery = await dispatchCodes(pending, emailCode, phoneCode);
  } catch {
    return { error: "send" as const };
  }
  if (delivery.email) delete pending.emailCode;
  if (delivery.sms) delete pending.phoneCode;

  store.registrations = [pending, ...(store.registrations || [])].slice(0, 40);
  saveStore(store);
  return { id, delivery, expiresAt: pending.expiresAt };
}

export function confirmRegistration(body: unknown) {
  const input = (body ?? {}) as { id?: unknown; emailCode?: unknown; phoneCode?: unknown };
  const id = text(input.id, 80);
  const emailCode = text(input.emailCode, 12);
  const phoneCode = text(input.phoneCode, 12);
  const store = getStore();
  const pending = (store.registrations || []).find((item) => item.id === id);
  if (!pending) return { error: "missing" as const };
  if (Date.parse(pending.expiresAt) <= Date.now() || pending.attempts >= MAX_ATTEMPTS) {
    return { error: "expired" as const };
  }

  const emailOk = pending.emailVerified || codesMatch(pending.emailCodeHash, pending.id, "email", emailCode);
  const phoneOk = pending.phoneVerified || codesMatch(pending.phoneCodeHash, pending.id, "phone", phoneCode);
  if (!emailOk || !phoneOk) {
    pending.attempts += 1;
    if (pending.attempts >= MAX_ATTEMPTS) {
      pending.expiresAt = new Date(0).toISOString();
      delete pending.emailCode;
      delete pending.phoneCode;
    }
    saveStore(store);
    return { error: "wrong" as const, emailOk, phoneOk };
  }
  pending.emailVerified = true;
  pending.phoneVerified = true;
  delete pending.emailCode;
  delete pending.phoneCode;

  let account = (store.clients || []).find((client) => client.id === pending.accountId || client.email === pending.email);
  if (!account) {
    account = {
      id: randomUUID(),
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    };
    store.clients = [account, ...(store.clients || [])];
  }
  saveStore(store);
  return { account };
}

export function unusedCodes() {
  const now = Date.now();
  return (getStore().registrations || [])
    .filter((item) => item.emailCode || item.phoneCode)
    .slice(0, 12)
    .map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      emailCode: item.emailCode || null,
      phoneCode: item.phoneCode || null,
      expiresAt: item.expiresAt,
      expired: Date.parse(item.expiresAt) <= now,
    }));
}

export function clientFromRequest(request: Request): ClientAccount | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith("studio_account="));
  if (!match) return null;
  const token = decodeURIComponent(match.slice("studio_account=".length));
  return clientFromToken(token, getStore().clients || []);
}

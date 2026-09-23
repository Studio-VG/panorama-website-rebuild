import type { Lead, LeadInput, PipelineStatus } from "../crm/model";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data as T;
}

export function fetchLeads(): Promise<{ leads: Lead[] }> {
  return request("/api/leads");
}

export function fetchLead(id: string): Promise<{ lead: Lead }> {
  return request(`/api/leads/${encodeURIComponent(id)}`);
}

export function createLead(input: LeadInput): Promise<{ lead: Lead }> {
  return request("/api/leads", { method: "POST", body: JSON.stringify(input) });
}

export function updateLead(id: string, input: LeadInput): Promise<{ lead: Lead }> {
  return request(`/api/leads/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function updateLeadStatus(
  id: string,
  input: { status: PipelineStatus; notes: string },
): Promise<{ lead: Lead }> {
  return request(`/api/leads/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

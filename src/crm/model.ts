export const PIPELINE_STATUSES = [
  "New",
  "Contacted",
  "Meeting set",
  "Proposal",
  "Won",
  "Lost",
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export const INTEREST_AREAS = [
  "investments",
  "retirement",
  "insurance",
  "planning",
] as const;

export type InterestArea = (typeof INTEREST_AREAS)[number];

export const INTEREST_LABELS: Record<InterestArea, string> = {
  investments: "Investments",
  retirement: "Retirement",
  insurance: "Insurance",
  planning: "Planning",
};

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  householdOrCompany: string;
  leadSource: string;
  status: PipelineStatus;
  notes: string;
  interestArea: InterestArea;
  createdAt: string;
}

export interface LeadInput {
  fullName: string;
  email: string;
  phone: string;
  householdOrCompany: string;
  leadSource: string;
  status: PipelineStatus;
  notes: string;
  interestArea: InterestArea;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPipelineStatus(value: string): value is PipelineStatus {
  return (PIPELINE_STATUSES as readonly string[]).includes(value);
}

export function isInterestArea(value: string): value is InterestArea {
  return (INTEREST_AREAS as readonly string[]).includes(value);
}

export function formatLeadDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseLeadInput(body: unknown): { value: LeadInput } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be an object." };
  }
  const record = body as Record<string, unknown>;
  const fullName = readString(record.fullName);
  if (!fullName) return { error: "Full name is required." };
  const email = readString(record.email);
  if (!email || !EMAIL_PATTERN.test(email)) return { error: "A valid email is required." };
  const phone = readString(record.phone);
  if (!phone) return { error: "Phone is required." };
  const householdOrCompany = readString(record.householdOrCompany);
  if (!householdOrCompany) return { error: "Household or company is required." };
  const leadSource = readString(record.leadSource);
  if (!leadSource) return { error: "Lead source is required." };
  const status = readString(record.status);
  if (!isPipelineStatus(status)) return { error: "Pipeline status is not recognized." };
  const interestArea = readString(record.interestArea);
  if (!isInterestArea(interestArea)) return { error: "Interest area is not recognized." };
  const notes = typeof record.notes === "string" ? record.notes.trim() : "";
  return {
    value: {
      fullName,
      email,
      phone,
      householdOrCompany,
      leadSource,
      status,
      notes,
      interestArea,
    },
  };
}

export function parseStatusNotes(
  body: unknown,
): { value: { status: PipelineStatus; notes: string } } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be an object." };
  }
  const record = body as Record<string, unknown>;
  const status = readString(record.status);
  if (!isPipelineStatus(status)) return { error: "Pipeline status is not recognized." };
  if (typeof record.notes !== "string") return { error: "Notes must be text." };
  return { value: { status, notes: record.notes.trim() } };
}

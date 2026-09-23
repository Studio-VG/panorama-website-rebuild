import { useEffect, useState, type FormEvent } from "react";
import {
  INTEREST_AREAS,
  INTEREST_LABELS,
  PIPELINE_STATUSES,
  type InterestArea,
  type LeadInput,
  type PipelineStatus,
} from "../crm/model";
import { createLead, fetchLead, updateLead } from "../lib/api";

interface LeadFormProps {
  mode: "create" | "edit";
  leadId?: string;
  onCancel: () => void;
  onSaved: () => void;
}

const EMPTY: LeadInput = {
  fullName: "",
  email: "",
  phone: "",
  householdOrCompany: "",
  leadSource: "",
  status: "New",
  notes: "",
  interestArea: "planning",
};

export function LeadForm({ mode, leadId, onCancel, onSaved }: LeadFormProps) {
  const [input, setInput] = useState<LeadInput>(EMPTY);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !leadId) return;
    let cancelled = false;
    fetchLead(leadId)
      .then(({ lead }) => {
        if (cancelled) return;
        setInput({
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          householdOrCompany: lead.householdOrCompany,
          leadSource: lead.leadSource,
          status: lead.status,
          notes: lead.notes,
          interestArea: lead.interestArea,
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this lead.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, leadId]);

  function update<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (mode === "edit" && leadId) {
        await updateLead(leadId, input);
      } else {
        await createLead(input);
      }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save this lead.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {mode === "edit" ? "Edit lead" : "Add lead"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Entered by an advisor. Nothing is emailed from here.</p>
      </div>

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading lead…</p>
      ) : (
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={input.fullName} onChange={(value) => update("fullName", value)} required />
            <Field label="Email" type="email" value={input.email} onChange={(value) => update("email", value)} required />
            <Field label="Phone" value={input.phone} onChange={(value) => update("phone", value)} required />
            <Field
              label="Household or company"
              value={input.householdOrCompany}
              onChange={(value) => update("householdOrCompany", value)}
              required
            />
            <Field label="Lead source" value={input.leadSource} onChange={(value) => update("leadSource", value)} required />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Interest area</span>
              <select
                value={input.interestArea}
                onChange={(event) => update("interestArea", event.target.value as InterestArea)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {INTEREST_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {INTEREST_LABELS[area]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Pipeline status</span>
              <select
                value={input.status}
                onChange={(event) => update("status", event.target.value as PipelineStatus)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {PIPELINE_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Notes</span>
            <textarea
              value={input.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={5}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save lead"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

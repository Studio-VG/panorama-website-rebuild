import { useEffect, useState, type FormEvent } from "react";
import {
  INTEREST_LABELS,
  PIPELINE_STATUSES,
  formatLeadDate,
  type Lead,
  type PipelineStatus,
} from "../crm/model";
import { fetchLead, updateLeadStatus } from "../lib/api";
import { StatusBadge } from "./StatusBadge";

interface LeadDetailProps {
  id: string;
  onBack: () => void;
  onEdit: () => void;
}

export function LeadDetail({ id, onBack, onEdit }: LeadDetailProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<PipelineStatus>("New");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLead(id)
      .then(({ lead: loaded }) => {
        if (cancelled) return;
        setLead(loaded);
        setStatus(loaded.status);
        setNotes(loaded.notes);
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
  }, [id]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!lead) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { lead: updated } = await updateLeadStatus(lead.id, { status, notes });
      setLead(updated);
      setStatus(updated.status);
      setNotes(updated.notes);
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading lead…</p>;

  if (!lead) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-rose-800">{error || "Lead not found."}</p>
        <button type="button" onClick={onBack} className="text-sm font-medium text-slate-700 underline">
          Back to leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Back to leads
          </button>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{lead.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Added {formatLeadDate(lead.createdAt)} · {lead.leadSource}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Edit lead
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">Contact</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Item label="Email" value={lead.email} />
            <Item label="Phone" value={lead.phone} />
            <Item label="Household or company" value={lead.householdOrCompany} />
            <Item label="Interest area" value={INTEREST_LABELS[lead.interestArea]} />
            <Item label="Lead source" value={lead.leadSource} />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current status</dt>
              <dd className="mt-1">
                <StatusBadge status={lead.status} />
              </dd>
            </div>
          </dl>
        </section>

        <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">Update</h2>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Pipeline status</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as PipelineStatus);
                setSaved(false);
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              {PIPELINE_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setSaved(false);
              }}
              rows={8}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-700">Saved</span>}
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save status and notes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

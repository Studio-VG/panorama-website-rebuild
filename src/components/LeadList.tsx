import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  INTEREST_LABELS,
  PIPELINE_STATUSES,
  formatLeadDate,
  type Lead,
  type PipelineStatus,
} from "../crm/model";
import { fetchLeads } from "../lib/api";
import { StatusBadge } from "./StatusBadge";

interface LeadListProps {
  onOpen: (id: string) => void;
}

export function LeadList({ onOpen }: LeadListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PipelineStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLeads()
      .then((data) => {
        if (!cancelled) setLeads(data.leads);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load leads.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (status && lead.status !== status) return false;
      if (!needle) return true;
      const haystack = [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.householdOrCompany,
        lead.leadSource,
        lead.notes,
        INTEREST_LABELS[lead.interestArea],
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [leads, query, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading the book…" : `${filtered.length} of ${leads.length} shown`}
          </p>
        </div>
        <a
          href="/leads/new"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add lead
        </a>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_14rem]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Search</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, phone, household, source"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as PipelineStatus | "")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">All statuses</option>
            {PIPELINE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No leads match this search.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Household or company</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <a href={`/leads/${lead.id}`} onClick={(event) => { event.preventDefault(); onOpen(lead.id); }} className="font-medium text-slate-900 hover:underline">
                        {lead.fullName}
                      </a>
                      <div className="text-slate-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{lead.householdOrCompany}</td>
                    <td className="px-4 py-3 text-slate-700">{INTEREST_LABELS[lead.interestArea]}</td>
                    <td className="px-4 py-3 text-slate-700">{lead.leadSource}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatLeadDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

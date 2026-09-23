import type { PipelineStatus } from "../crm/model";

const STYLES: Record<PipelineStatus, string> = {
  New: "bg-slate-100 text-slate-700 ring-slate-200",
  Contacted: "bg-sky-50 text-sky-800 ring-sky-100",
  "Meeting set": "bg-amber-50 text-amber-900 ring-amber-100",
  Proposal: "bg-violet-50 text-violet-800 ring-violet-100",
  Won: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  Lost: "bg-rose-50 text-rose-800 ring-rose-100",
};

export function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}>
      {status}
    </span>
  );
}

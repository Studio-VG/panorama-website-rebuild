import { useEffect, useState } from "react";
import { LeadDetail } from "./components/LeadDetail";
import { LeadForm } from "./components/LeadForm";
import { LeadList } from "./components/LeadList";

type Route =
  | { name: "list" }
  | { name: "new" }
  | { name: "detail"; id: string }
  | { name: "edit"; id: string };

function parseRoute(pathname: string): Route {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "leads" && parts[1] === "new") return { name: "new" };
  if (parts.length === 3 && parts[0] === "leads" && parts[2] === "edit") {
    return { name: "edit", id: decodeURIComponent(parts[1]) };
  }
  if (parts.length === 2 && parts[0] === "leads") {
    return { name: "detail", id: decodeURIComponent(parts[1]) };
  }
  return { name: "list" };
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    const title =
      route.name === "new"
        ? "Add lead · Advisor CRM"
        : route.name === "edit"
          ? "Edit lead · Advisor CRM"
          : route.name === "detail"
            ? "Lead · Advisor CRM"
            : "Leads · Advisor CRM";
    document.title = title;
  }, [route]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">A</span>
            <span>
              <span className="block text-sm font-semibold leading-tight">Advisor CRM</span>
              <span className="block text-xs text-slate-500">Internal lead desk</span>
            </span>
          </a>
          {route.name !== "list" && (
            <a href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              All leads
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {route.name === "list" && <LeadList onOpen={(id) => navigate(`/leads/${encodeURIComponent(id)}`)} />}
        {route.name === "new" && (
          <LeadForm mode="create" onCancel={() => navigate("/")} onSaved={() => navigate("/")} />
        )}
        {route.name === "detail" && (
          <LeadDetail
            id={route.id}
            onBack={() => navigate("/")}
            onEdit={() => navigate(`/leads/${encodeURIComponent(route.id)}/edit`)}
          />
        )}
        {route.name === "edit" && (
          <LeadForm
            mode="edit"
            leadId={route.id}
            onCancel={() => navigate(`/leads/${encodeURIComponent(route.id)}`)}
            onSaved={() => navigate(`/leads/${encodeURIComponent(route.id)}`)}
          />
        )}
      </main>
    </div>
  );
}

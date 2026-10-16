"use client";

import { FormEvent, useState } from "react";
import type { PortfolioImage } from "@/lib/types";

type Thread = {
  id: string;
  clientName: string;
  messages: { id: string; from: "guest" | "client"; body: string }[];
};

type ArtistDraft = {
  name: string;
  blurb: string;
  history: string;
  styles: string[];
  portfolio: PortfolioImage[];
};

export function GuestLogin() {
  const [slug, setSlug] = useState("sample-guest");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/guest/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });
    if (!response.ok) {
      setError("That guest sign-in did not match.");
      return;
    }
    window.location.href = "/guest/studio";
  }

  return (
    <section className="section">
      <div className="shell" style={{ maxWidth: 520 }}>
        <p className="eyebrow">Guest portal</p>
        <h1>Sign in</h1>
        <p>This room is for a guest artist. There is no field for a phone, an email, Instagram, Facebook, or WhatsApp. The example seat is <strong>sample-guest</strong>, password <strong>guest-demo</strong>.</p>
        <form onSubmit={onSubmit}>
          <label>Guest page name
            <input value={slug} onChange={(event) => setSlug(event.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn" type="submit">Enter</button>
        </form>
      </div>
    </section>
  );
}

export function GuestStudio({ artist, threads }: { artist: ArtistDraft; threads: Thread[] }) {
  const [draft, setDraft] = useState(artist);
  const [open, setOpen] = useState(threads[0]?.id || "");
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [localThreads, setLocalThreads] = useState(threads);
  const current = localThreads.find((thread) => thread.id === open);

  async function save(event: FormEvent) {
    event.preventDefault();
    setNote("");
    const response = await fetch("/api/guest/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, styles: draft.styles.join(", ") }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNote(payload.error || "Not saved.");
      return;
    }
    setDraft({ ...payload.artist, styles: payload.artist.styles });
    setNote("Saved. Off-site links and numbers were stripped if they were in the text.");
  }

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/guest/upload", { method: "POST", body });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNote(payload.error || "The image was not saved.");
      return;
    }
    setDraft({
      ...draft,
      portfolio: [...draft.portfolio, { id: crypto.randomUUID(), src: payload.url, alt: draft.name, caption: "" }],
    });
  }

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!current) return;
    const response = await fetch("/api/guest/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: current.id, body: reply }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNote(payload.error || "The reply was not sent.");
      return;
    }
    setLocalThreads(localThreads.map((thread) => thread.id === current.id ? payload.thread : thread));
    setReply("");
  }

  return (
    <section className="section">
      <div className="shell split">
        <form onSubmit={save}>
          <p className="eyebrow">Your page</p>
          <h1>{draft.name}</h1>
          <label>Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
          </label>
          <label>Short text
            <textarea value={draft.blurb} onChange={(event) => setDraft({ ...draft, blurb: event.target.value })} required />
          </label>
          <label>Longer text
            <textarea value={draft.history} onChange={(event) => setDraft({ ...draft, history: event.target.value })} />
          </label>
          <label>Styles, separated by commas
            <input value={draft.styles.join(", ")} onChange={(event) => setDraft({ ...draft, styles: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
          </label>
          <div className="thumb-row">
            {draft.portfolio.map((image) => (
              <figure key={image.id}>
                <img src={image.src} alt={image.alt} />
                <button className="btn danger" type="button" onClick={() => setDraft({ ...draft, portfolio: draft.portfolio.filter((item) => item.id !== image.id) })}>Remove</button>
              </figure>
            ))}
          </div>
          <label>Portfolio image
            <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
          </label>
          {note ? <p className="form-ok">{note}</p> : null}
          <button className="btn" type="submit">Save page</button>
        </form>
        <div>
          <p className="eyebrow">Clients</p>
          <h2>Messages</h2>
          <div className="thread-list">
            {localThreads.map((thread) => (
              <button className="list-btn" type="button" key={thread.id} onClick={() => setOpen(thread.id)} aria-current={thread.id === open ? "true" : undefined}>
                {thread.clientName}
              </button>
            ))}
          </div>
          {current ? (
            <>
              <div className="chat-log">
                {current.messages.map((message) => (
                  <article key={message.id} className={message.from === "guest" ? "mine" : ""}>
                    <p className="eyebrow">{message.from === "guest" ? "You" : current.clientName}</p>
                    <p>{message.body}</p>
                  </article>
                ))}
              </div>
              <form onSubmit={sendReply}>
                <label>Reply
                  <textarea value={reply} onChange={(event) => setReply(event.target.value)} required />
                </label>
                <button className="btn" type="submit">Send</button>
              </form>
            </>
          ) : <p>No client has written yet.</p>}
        </div>
      </div>
    </section>
  );
}

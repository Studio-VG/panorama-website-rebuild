"use client";

import { FormEvent, useState } from "react";

type Msg = { id: string; from: "guest" | "client"; body: string; createdAt: string };

export function ClientChat({ slug, initial, labels }: { slug: string; initial: Msg[]; labels?: { you: string; guest: string; name: string; message: string; send: string; error: string } }) {
  const text = labels || { you: "You", guest: "Guest", name: "Your name", message: "Message", send: "Send on this site", error: "The message was not sent." };
  const [messages, setMessages] = useState(initial);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, clientName: name, body }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || text.error);
      return;
    }
    setMessages(payload.messages || []);
    setBody("");
  }

  return (
    <div>
      <div className="chat-log">
        {messages.map((message) => (
          <article key={message.id} className={message.from === "client" ? "mine" : ""}>
            <p className="eyebrow">{message.from === "client" ? text.you : text.guest}</p>
            <p>{message.body}</p>
          </article>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <label>{text.name}
          <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
        </label>
        <label>{text.message}
          <textarea value={body} onChange={(event) => setBody(event.target.value)} required minLength={2} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn" type="submit">{text.send}</button>
      </form>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import type { Messages } from "@/lib/messages";
import type { Artist } from "@/lib/types";

export function InquiryForm({
  artists,
  defaultArtist,
  labels,
  client,
  registerHref,
}: {
  artists: Artist[];
  defaultArtist?: string;
  labels: Messages["form"];
  client: { name: string; email: string; phone: string };
  registerHref: string;
}) {
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOk("");
    setPending(true);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (response.status === 401 || body.code === "register") {
      window.location.href = registerHref;
      return;
    }
    if (!response.ok) {
      setError(body.error || labels.error);
      return;
    }
    form.reset();
    setOk(labels.ok);
  }

  return (
    <form className="book-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="inquiry-name">{labels.name}
        <input id="inquiry-name" name="name" autoComplete="name" value={client.name} readOnly required />
      </label>
      <label htmlFor="inquiry-email">{labels.email}
        <input id="inquiry-email" name="email" type="email" autoComplete="email" value={client.email} readOnly required />
      </label>
      <label htmlFor="inquiry-phone">{labels.phone}
        <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" value={client.phone} readOnly required />
      </label>
      <label htmlFor="inquiry-artist">{labels.artist}
        <select id="inquiry-artist" name="artist" defaultValue={defaultArtist && artists.some((artist) => artist.name === defaultArtist) ? defaultArtist : labels.preference}>
          <option>{labels.preference}</option>
          {artists.map((artist) => <option key={artist.id}>{artist.name}</option>)}
        </select>
      </label>
      <label htmlFor="inquiry-message">{labels.message}
        <textarea id="inquiry-message" name="message" required minLength={10} />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {ok ? <p className="form-ok" role="status">{ok}</p> : null}
      <button className="btn btn-ink" type="submit" disabled={pending}>
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  );
}

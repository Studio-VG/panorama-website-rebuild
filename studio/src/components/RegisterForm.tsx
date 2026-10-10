"use client";

import { FormEvent, useState } from "react";
import type { Messages } from "@/lib/messages";

export function RegisterForm({
  labels,
  nextPath,
  signedInName,
}: {
  labels: Messages["register"];
  nextPath: string;
  signedInName?: string;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [challenge, setChallenge] = useState("");

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/client/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error === "mismatch" ? labels.mismatch : body.error === "expired" ? labels.expired : labels.error);
      return;
    }
    setChallenge(String(body.id || ""));
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/client/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: challenge }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error === "expired" ? labels.expired : labels.wrong);
      return;
    }
    window.location.href = nextPath;
  }

  if (signedInName) {
    return (
      <div className="book-form">
        <p>{labels.signedIn.replace("{name}", signedInName)}</p>
        <p><a className="btn" href={nextPath}>{labels.bookLink}</a></p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <form className="book-form" onSubmit={start} noValidate>
        <label htmlFor="register-name">{labels.name}
          <input id="register-name" name="name" autoComplete="name" required />
        </label>
        <label htmlFor="register-email">{labels.email}
          <input id="register-email" name="email" type="email" autoComplete="email" required />
        </label>
        <label htmlFor="register-phone">{labels.phone}
          <input id="register-phone" name="phone" type="tel" autoComplete="tel" required />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="btn btn-ink" type="submit" disabled={pending}>{pending ? labels.sending : labels.send}</button>
      </form>
    );
  }

  return (
    <form className="book-form" onSubmit={confirm}>
      <p>{labels.codesLead}</p>
      <label htmlFor="register-email-code">{labels.emailCode}
        <input id="register-email-code" name="emailCode" inputMode="numeric" autoComplete="one-time-code" required />
      </label>
      <label htmlFor="register-phone-code">{labels.phoneCode}
        <input id="register-phone-code" name="phoneCode" inputMode="numeric" autoComplete="one-time-code" required />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-ink" type="submit" disabled={pending}>{pending ? labels.confirming : labels.confirm}</button>
    </form>
  );
}

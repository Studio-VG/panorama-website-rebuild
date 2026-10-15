"use client";

import { FormEvent, useState } from "react";
import { AuthProviders } from "@/components/AuthProviders";
import type { Messages } from "@/lib/messages";

export function SignInForm({
  labels,
  nextPath,
  signedInName,
}: {
  labels: Messages["signIn"];
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
    const response = await fetch("/api/client/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error === "unknown" ? labels.unknown : labels.error);
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
      body: JSON.stringify({ ...data, id: challenge, emailCode: "000000" }),
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
    return <p>{labels.title}: {signedInName}</p>;
  }

  if (!challenge) {
    return (
      <form className="book-form" onSubmit={start} noValidate>
        <AuthProviders nextPath={nextPath} />
        <label htmlFor="signin-contact">{labels.identifier}
          <input id="signin-contact" name="contact" autoComplete="username" required />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="btn btn-ink" type="submit" disabled={pending}>{pending ? labels.sending : labels.send}</button>
      </form>
    );
  }

  return (
    <form className="book-form" onSubmit={confirm}>
      <label htmlFor="signin-code">{labels.code}
        <input id="signin-code" name="phoneCode" inputMode="numeric" autoComplete="one-time-code" required />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-ink" type="submit" disabled={pending}>{pending ? labels.confirming : labels.confirm}</button>
    </form>
  );
}

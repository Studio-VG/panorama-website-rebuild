import Link from "next/link";
import { headers } from "next/headers";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";

export default async function NotFound() {
  const headerStore = await headers();
  const value = headerStore.get("x-locale");
  const lang = isLocale(value) ? value : "en";
  const copy = messages[lang];
  return (
    <section className="section">
      <div className="shell">
        <h1>{copy.notFound.title}</h1>
        <p>{copy.notFound.body}</p>
        <Link className="btn" href={`/${lang}`}>{copy.notFound.home}</Link>
      </div>
    </section>
  );
}

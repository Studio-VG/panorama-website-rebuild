import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SignInForm } from "@/components/SignInForm";
import { CLIENT_COOKIE, clientFromToken } from "@/lib/auth";
import { isLocale, locales, type Locale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string }> };

function nextPath(value: string | undefined, lang: Locale) {
  if (value && locales.some((locale) => value === `/${locale}/book`)) return value;
  return `/${lang}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang].signIn;
  return pageMetadata({ lang, title: copy.title, description: copy.lead, path: "/sign-in" });
}

export default async function SignInPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const query = await searchParams;
  const copy = messages[lang];
  const token = (await cookies()).get(CLIENT_COOKIE)?.value;
  const client = clientFromToken(token, getStore().clients || []);
  return (
    <section className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <h1>{copy.signIn.title}</h1>
        <p>{copy.signIn.lead}</p>
        <SignInForm labels={copy.signIn} nextPath={nextPath(query.next, lang)} signedInName={client?.name} />
      </div>
    </section>
  );
}

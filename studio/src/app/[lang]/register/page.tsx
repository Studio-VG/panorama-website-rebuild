import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/RegisterForm";
import { CLIENT_COOKIE, clientFromToken } from "@/lib/auth";
import { isLocale, locales, type Locale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { codeDelivery } from "@/lib/clients";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string }> };

function nextPath(value: string | undefined, lang: Locale) {
  if (value && locales.some((locale) => value === `/${locale}/book`)) return value;
  return `/${lang}/book`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang].register;
  return pageMetadata({ lang, title: copy.title, description: copy.lead, path: "/register" });
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const query = await searchParams;
  const copy = messages[lang];
  const token = (await cookies()).get(CLIENT_COOKIE)?.value;
  const client = clientFromToken(token, getStore().clients || []);
  const delivery = codeDelivery();
  return (
    <section className="section">
      <div className="shell split">
        <div>
          <p className="kicker">{copy.nav.kicker}</p>
          <h1>{copy.register.title}</h1>
          <p>{copy.register.lead}</p>
          <p>{delivery.email || delivery.sms ? copy.register.sent : copy.register.delivery}</p>
        </div>
        <RegisterForm labels={copy.register} nextPath={nextPath(query.next, lang)} signedInName={client?.name} />
      </div>
    </section>
  );
}

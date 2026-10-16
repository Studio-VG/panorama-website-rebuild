import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { CLIENT_COOKIE, clientFromToken } from "@/lib/auth";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { istanbulAddress, pageMetadata } from "@/lib/seo";
import { getStore, isGuest, publicArtist } from "@/lib/store";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ artist?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.bookTitle,
    description: copy.seo.bookDescription,
    path: "/book",
  });
}

export default async function BookPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { artist } = await searchParams;
  const copy = messages[lang];
  const store = getStore();
  const { settings, artists, locations } = store;
  const residents = artists.filter((artist) => !isGuest(artist)).map(publicArtist);
  const street = istanbulAddress(settings, locations);
  const token = (await cookies()).get(CLIENT_COOKIE)?.value;
  const account = clientFromToken(token, store.clients || []);
  const client = account?.emailVerified && account.phoneVerified ? account : null;
  const registerHref = `/${lang}/register?next=/${lang}/book`;
  return (
    <section className="home-lower">
      <div className="shell split">
        <div>
          <h1 className="home-legend">{copy.book.title}</h1>
          <p>{copy.book.lead}</p>
          <p>{street}</p>
          <p><a href={`mailto:${settings.email}`}>{settings.email}</a> · <a href={settings.whatsappUrl}>{copy.about.whatsapp}</a></p>
        </div>
        {client ? (
          <InquiryForm artists={residents} defaultArtist={artist} labels={copy.form} client={client} registerHref={registerHref} />
        ) : (
          <div className="book-form">
            <p>{copy.book.needAccount}</p>
            <p className="home-book" style={{ justifyContent: "flex-start", gap: "0.75rem" }}>
              <Link className="btn" href={registerHref}>{copy.book.register}</Link>
              <Link className="btn" href={`/${lang}/sign-in?next=/${lang}/book`}>{copy.nav.signIn}</Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

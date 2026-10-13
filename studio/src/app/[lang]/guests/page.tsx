import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata({
    lang,
    title: messages[lang].nav.guests,
    description: messages[lang].salon.guestListMeta,
    path: "/artists",
  });
}

export default async function GuestsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/artists#guests`);
}

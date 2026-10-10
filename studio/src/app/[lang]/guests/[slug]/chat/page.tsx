import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ClientChat } from "@/components/ClientChat";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { getStore, isGuest } from "@/lib/store";

type Props = { params: Promise<{ lang: string; slug: string }> };

export default async function GuestChatPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const store = getStore();
  const artist = store.artists.find((item) => item.slug === slug && isGuest(item));
  if (!artist) notFound();
  const token = (await cookies()).get(`studio_client_${artist.id}`)?.value;
  const thread = (store.threads || []).find((item) => item.guestId === artist.id && item.clientToken === token);
  const salon = messages[lang].salon;
  return (
    <section className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <p className="eyebrow">{salon.chatEyebrow}</p>
        <h1>{artist.name}</h1>
        <p>{salon.chatLead}</p>
        <ClientChat
          slug={artist.slug}
          initial={thread?.messages || []}
          labels={{ you: salon.chatYou, guest: salon.chatGuest, name: salon.chatName, message: salon.chatMessage, send: salon.chatSend, error: salon.chatError }}
        />
      </div>
    </section>
  );
}

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAuthed } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminChatsPage() {
  if (!isAuthed((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin");
  const store = getStore();
  const threads = store.threads || [];
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Studio admin</p>
        <h1>Guest conversations</h1>
        <p>Every thread between a guest artist and a client. Guests only see their own.</p>
        <p><Link href="/admin">Back to settings</Link></p>
        {threads.length === 0 ? <p>No conversations yet.</p> : threads.map((thread) => {
          const guest = store.artists.find((artist) => artist.id === thread.guestId);
          return (
            <article className="panel" key={thread.id} style={{ marginBottom: "1rem" }}>
              <h2>{guest?.name || "Guest"} · {thread.clientName}</h2>
              <div className="chat-log">
                {thread.messages.map((message) => (
                  <article key={message.id}>
                    <p className="eyebrow">{message.from === "guest" ? guest?.name || "Guest" : thread.clientName}</p>
                    <p>{message.body}</p>
                  </article>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

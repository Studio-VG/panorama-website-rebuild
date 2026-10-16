import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GuestStudio } from "@/components/GuestPortal";
import { GUEST_COOKIE, guestFromToken } from "@/lib/auth";
import { getStore, publicArtist, publicThread } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GuestStudioPage() {
  const store = getStore();
  const guest = guestFromToken((await cookies()).get(GUEST_COOKIE)?.value, store.artists);
  if (!guest) redirect("/guest");
  const artist = publicArtist(guest);
  const threads = (store.threads || []).filter((thread) => thread.guestId === guest.id).map(publicThread);
  return <GuestStudio artist={artist} threads={threads} />;
}

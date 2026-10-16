import { SiteHeader } from "@/components/SiteHeader";
import { messages } from "@/lib/messages";
import { getStore } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const copy = messages.en;
  const { settings } = getStore();
  return (
    <>
      <a className="skip" href="#content">{copy.nav.skip}</a>
      <SiteHeader name={settings.name} logo={settings.logoUrl} lang="en" labels={copy.nav} />
      <main id="content">{children}</main>
    </>
  );
}

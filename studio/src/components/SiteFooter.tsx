import { telHref } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { Messages } from "@/lib/messages";
import type { Settings } from "@/lib/types";
import { FooterAddress } from "@/components/FooterAddress";
import { StudioMap } from "@/components/StudioMap";

export function SiteFooter({ settings, lang, labels }: {
  settings: Settings;
  lang: Locale;
  labels: Messages["footer"];
}) {
  return (
    <footer className="site-footer" data-lang={lang}>
      <div className="shell footer-grid">
        <div>
          <p className="footer-title">{settings.name}</p>
          <p>{settings.tagline}</p>
          <FooterAddress address={settings.address} />
          <StudioMap address={settings.address} />
        </div>
        <div>
          <p className="footer-title">{labels.reach}</p>
          <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
          {settings.phoneAlt ? <p><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></p> : null}
          {settings.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
          <p><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></p>
          <p><a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></p>
        </div>
      </div>
      <div className="shell"><p className="fine">{labels.note}</p></div>
    </footer>
  );
}

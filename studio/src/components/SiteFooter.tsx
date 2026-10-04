import { telHref } from "@/lib/format";
import { serviceGroups } from "@/lib/locations";
import type { Locale } from "@/lib/locale";
import type { Messages } from "@/lib/messages";
import type { Location, Settings } from "@/lib/types";
import { StudioMap } from "@/components/StudioMap";

function PinIcon() {
  return (
    <svg className="loc-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#e24b3b" d="M12 2.2c-4 0-7.2 3.1-7.2 7.1 0 5.3 7.2 12.5 7.2 12.5s7.2-7.2 7.2-12.5c0-4-3.2-7.1-7.2-7.1z" />
      <circle cx="12" cy="9.2" r="2.6" fill="#fff" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="loc-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7.2 3.4h2.2l1.1 3.2-1.6 1a12 12 0 0 0 5.5 5.5l1-1.6 3.2 1.1v2.2c0 .8-.6 1.5-1.4 1.6A14.6 14.6 0 0 1 5.6 4.8c.1-.8.8-1.4 1.6-1.4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="loc-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3.5 6.2h17v11.6h-17V6.2zm8.5 6.4 7-4.4H5l7 4.4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="loc-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5zm8 1.6H8A2.9 2.9 0 0 0 5.1 8v8A2.9 2.9 0 0 0 8 18.9h8a2.9 2.9 0 0 0 2.9-2.9V8A2.9 2.9 0 0 0 16 5.1zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm4.35-2.55a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="loc-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M14.2 20.5v-7.2h2.4l.4-2.8h-2.8V8.8c0-.8.2-1.4 1.4-1.4H17V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4v2.8h2.4v7.1h2.9z" />
    </svg>
  );
}

export function SiteFooter({ settings, locations, lang, labels }: {
  settings: Settings;
  locations: Location[];
  lang: Locale;
  labels: Messages["footer"];
}) {
  const email = "termini@vasovasiko.com";
  const many = locations.length > 1;
  const groups = serviceGroups(locations, labels);
  return (
    <footer className="site-footer" data-lang={lang}>
      <div className="shell">
        <section className="location-panel" aria-label={labels.location}>
          <h2 className="location-heading"><PinIcon />{labels.location}</h2>
          <div className={many ? "location-grid locations-many" : "location-grid"}>
            {locations.map((place) => (
              <div className="map-card" key={place.id}>
                {many ? <h3 className="place-name">{place.name}</h3> : null}
                <StudioMap address={place.address} mapQuery={place.mapQuery} className="map-frame map-card-frame" />
                <div className="map-card-body">
                  <a className="map-open" href={place.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <PinIcon />
                    {labels.openMaps}
                    <span className="sr-only"> ({labels.newTab})</span>
                  </a>
                  <address>{place.address}</address>
                  <a className="map-directions" href={place.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {labels.directions}
                    <span className="sr-only"> ({labels.newTab})</span>
                  </a>
                </div>
              </div>
            ))}
            <div className="service-col">
              <h3>{labels.serviceArea}</h3>
              <ul className="service-list">
                {groups.map((group) => (
                  <li className="service-city" key={group.key}>
                    <span className="city-name"><PinIcon />{group.label}</span>
                    {group.venues.length > 0 ? (
                      <ul className="venue-list">
                        {group.venues.map((venue) => <li key={venue}>{venue}</li>)}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
              <h3>{labels.contact}</h3>
              <div className="contact-rows">
                <p><PhoneIcon /><a href={telHref(settings.phone)}>{settings.phone}</a></p>
                {settings.phoneAlt ? <p><PhoneIcon /><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></p> : null}
                <p><MailIcon /><a href={`mailto:${email}`}>{email}</a></p>
              </div>
              <div className="location-social">
                <a href="https://www.instagram.com/vasovasiko/" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon />
                  Instagram
                  <span className="sr-only"> ({labels.newTab})</span>
                </a>
                <a href="https://www.facebook.com/vasovasiko" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                  Facebook
                  <span className="sr-only"> ({labels.newTab})</span>
                </a>
              </div>
            </div>
          </div>
          <p className="location-line">{groups.map((group) => group.label).join(" • ")}</p>
        </section>
      </div>
      <div className="shell"><p className="fine">{labels.note}</p></div>
    </footer>
  );
}

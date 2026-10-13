"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, switchLocale, type Locale } from "@/lib/locale";
import type { Messages } from "@/lib/messages";

export function SiteHeader({
  name,
  logo,
  lang,
  labels,
}: {
  name: string;
  logo: string;
  lang: Locale;
  labels: Messages["nav"];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const onAdmin = pathname.startsWith("/admin");
  const home = !onAdmin && /^\/(en|tr|de|ru|ka)$/.test(pathname);
  useEffect(() => { setOpen(false); }, [pathname]);
  const links = [
    [`/${lang}/artists`, labels.artists],
    [`/${lang}/guests`, labels.guests],
    [`/${lang}/events`, labels.events],
    [`/${lang}/about`, labels.about],
    [`/${lang}/faq`, labels.faq],
    [`/${lang}/register`, labels.register],
  ];

  return (
    <header className={home ? "site-header home-float" : "site-header"}>
      <div className="shell header-inner">
        <Link href={onAdmin ? "/en" : `/${lang}`} className="brand" onClick={() => setOpen(false)}>
          <img src={logo || "/brand/logo.png"} alt="" />
          {home ? (
            <>
              <h1 className="brand-name">{name}</h1>
              <small>{labels.kicker}</small>
            </>
          ) : (
            <span>
              <span className="brand-name">{name}</span>
              <small>{labels.kicker}</small>
            </span>
          )}
        </Link>
        {onAdmin ? null : (
          <>
            <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? labels.close : labels.menu} onClick={() => setOpen((value) => !value)}>
              <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
            </button>
            <ul id="site-menu" className={open ? "nav-links open" : "nav-links"}>
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></li>
              ))}
              <li><Link className="btn" href={`/${lang}/book`} onClick={() => setOpen(false)}>{labels.book}</Link></li>
              <li>
                <nav className="langs" aria-label={labels.languages}>
                  {locales.map((code) => (
                    <Link key={code} href={switchLocale(pathname, code)} hrefLang={code} lang={code} aria-current={code === lang ? "page" : undefined} onClick={() => setOpen(false)}>
                      {code.toUpperCase()}
                    </Link>
                  ))}
                </nav>
              </li>
            </ul>
          </>
        )}
      </div>
    </header>
  );
}

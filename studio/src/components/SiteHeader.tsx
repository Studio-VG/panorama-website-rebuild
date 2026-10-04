"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const links = [
    [`/${lang}/artists`, labels.artists],
    [`/${lang}/events`, labels.events],
    [`/${lang}/about`, labels.about],
    [`/${lang}/faq`, labels.faq],
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href={onAdmin ? "/en" : `/${lang}`} className="brand" onClick={() => setOpen(false)}>
          <img src={logo || "/brand/logo.png"} alt="" />
          <span>
            <span className="brand-name">{name}</span>
            <small>{labels.kicker}</small>
          </span>
        </Link>
        {onAdmin ? null : (
          <>
            <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((value) => !value)}>
              {open ? labels.close : labels.menu}
            </button>
            <ul id="site-menu" className={open ? "nav-links open" : "nav-links"}>
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></li>
              ))}
              <li><Link className="btn" href={`/${lang}/book`} onClick={() => setOpen(false)}>{labels.book}</Link></li>
              <li>
                <nav className="langs" aria-label={labels.languages}>
                  {locales.map((code) => (
                    <Link key={code} href={switchLocale(pathname, code)} hrefLang={code} lang={code} aria-current={code === lang ? "page" : undefined}>
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

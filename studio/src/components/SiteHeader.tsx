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
  const [langsOpen, setLangsOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const pathname = usePathname() || `/${lang}`;
  const onAdmin = pathname.startsWith("/admin");
  const sparse = !onAdmin && /^\/(en|tr|de|ru|ka)(\/(artists|events|about)(\/.*)?)?$/.test(pathname);
  const links = [
    [`/${lang}/artists`, labels.artists],
    [`/${lang}/events`, labels.events],
    [`/${lang}/about`, labels.about],
    [`/${lang}/faq`, labels.faq],
  ];

  useEffect(() => {
    setOpen(false);
    setLangsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (onAdmin) return;
    let stop = false;
    fetch("/api/client/session")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!stop) setAccount(typeof body?.name === "string" ? body.name : null);
      })
      .catch(() => {
        if (!stop) setAccount(null);
      });
    return () => {
      stop = true;
    };
  }, [onAdmin, pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const menu = document.getElementById("site-menu");
      const button = document.querySelector(".menu-toggle");
      if (menu?.contains(target) || button?.contains(target)) return;
      setOpen(false);
      setLangsOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function signOut() {
    await fetch("/api/client/signout", { method: "POST" });
    setAccount(null);
    setOpen(false);
  }

  return (
    <header className={sparse ? "site-header home-float" : "site-header"}>
      <div className="shell header-inner">
        {sparse ? (
          <div className="brand">
            <img src={logo || "/brand/logo.png"} alt="" />
            <h1 className="brand-name">{name}</h1>
          </div>
        ) : (
          <Link href={onAdmin ? "/en" : `/${lang}`} className="brand" onClick={() => setOpen(false)}>
            <img src={logo || "/brand/logo.png"} alt="" />
            <span>
              <span className="brand-name">{name}</span>
              <small>{labels.kicker}</small>
            </span>
          </Link>
        )}
        {onAdmin ? null : (
          <>
            <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? labels.close : labels.menu} onClick={() => setOpen((value) => !value)}>
              <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
            </button>
            <ul id="site-menu" className={open ? "nav-links open" : "nav-links"}>
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></li>
              ))}
              {account ? (
                <>
                  <li className="menu-account">{labels.account.replace("{name}", account)}</li>
                  <li><button className="btn" type="button" onClick={signOut}>{labels.signOut}</button></li>
                </>
              ) : (
                <>
                  <li><Link className="btn" href={`/${lang}/register`} onClick={() => setOpen(false)}>{labels.register}</Link></li>
                  <li><Link className="btn" href={`/${lang}/sign-in`} onClick={() => setOpen(false)}>{labels.signIn}</Link></li>
                </>
              )}
              <li><Link className="btn" href={`/${lang}/book`} onClick={() => setOpen(false)}>{labels.book}</Link></li>
              <li className={langsOpen ? "lang-slot open" : "lang-slot"}>
                <button className="lang-toggle" type="button" aria-expanded={langsOpen} aria-controls="lang-choices" onClick={() => setLangsOpen((value) => !value)}>
                  {lang.toUpperCase()}
                </button>
                <nav id="lang-choices" className="lang-choices" aria-label={labels.languages} hidden={!langsOpen}>
                  {locales.filter((code) => code !== lang).map((code) => (
                    <Link key={code} href={switchLocale(pathname, code)} hrefLang={code} lang={code} onClick={() => setOpen(false)}>
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

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLocale } from "@/lib/locale";

export function HtmlLang() {
  const pathname = usePathname() || "/";
  const segment = pathname.split("/")[1];
  const lang = isLocale(segment) ? segment : "en";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

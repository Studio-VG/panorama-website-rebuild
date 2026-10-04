"use client";

import { usePathname } from "next/navigation";

export function FooterAddress({ address }: { address: string }) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return null;
  return <address>{address}</address>;
}

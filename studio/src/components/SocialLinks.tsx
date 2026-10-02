import type { Settings } from "@/lib/types";

export function SocialLinks({ settings, portfolio, newTab }: { settings: Settings; portfolio: string; newTab: string }) {
  const links = [
    ["Instagram", settings.instagramUrl],
    ["Facebook", settings.facebookUrl],
    [portfolio, settings.portfolioUrl],
  ];
  return (
    <ul className="tags">
      {links.filter(([, href]) => href).map(([label, href]) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
            <span className="sr-only"> ({newTab})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

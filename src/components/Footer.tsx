import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Globe, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { CATALOG } from '../data/catalog';
import { translations } from '../i18n/translations';

interface FooterProps {
  currentLang: Language;
  onNavigate: (sectionId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate, onSelectProduct }) => {
  const t = translations[currentLang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink-950 text-slate-400 border-t border-ink-800/80 pt-16 pb-12 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-ink-800">
          <div className="lg:col-span-3 space-y-5 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-ink-900 border border-brass-500/40 flex items-center justify-center shadow-md">
                <span className="font-display font-black text-xl text-brass-400">P</span>
              </div>
              <div>
                <span className="font-sans font-extrabold text-xl tracking-[0.18em] text-white uppercase block">
                  {currentLang === 'ka' ? 'პანორამა' : 'PANORAMA'}
                </span>
                <span className="text-[10px] text-brass-400 font-mono tracking-wider uppercase font-semibold">
                  {currentLang === 'ka' ? 'ალუმინისა & მინის სისტემები' : 'Architectural Systems Georgia'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{t.footer.about}</p>

            <div className="pt-2 text-[11px] text-slate-400">
              <span className="font-mono text-brass-300 block">{t.footer.productionTbilisi}</span>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@panorama_glass"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 text-slate-300 hover:text-white border border-ink-800 text-xs transition-colors"
                id="footer-tiktok-link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.93-4.47V8.62a8.27 8.27 0 0 0 4.84 1.55V6.69h-1z" />
                </svg>
                <span>TikTok: @panorama_glass</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t.footer.systemsList}</h4>
            <ul className="space-y-2 text-xs">
              {CATALOG.map((prod) => (
                <li key={prod.id}>
                  <button
                    onClick={() => {
                      onSelectProduct(prod.id);
                      onNavigate('systems');
                    }}
                    className="hover:text-brass-400 transition-colors text-left"
                    id={`footer-prod-${prod.id}`}
                  >
                    {prod.name[currentLang]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{currentLang === 'ka' ? 'ოფისის ლოკაცია' : currentLang === 'ru' ? 'Локация офиса' : 'Office Location'}</span>
            </h4>

            <a
              href="https://maps.app.goo.gl/67CeMMs11PqBrVJY9"
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-xl overflow-hidden border border-ink-800 hover:border-brass-500/60 bg-ink-900 shadow-md hover:shadow-brass-500/10 transition-all duration-300"
              id="footer-google-maps-card"
              title={currentLang === 'ka' ? 'გახსენით Google Maps-ში' : 'Open in Google Maps'}
            >
              <div className="h-28 w-full relative overflow-hidden bg-ink-950">
                <svg className="absolute inset-0 w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out" viewBox="0 0 240 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 25 H240 M0 65 H240 M0 100 H240" stroke="#2a2d31" strokeWidth="2.5" />
                  <path d="M45 0 V120 M115 0 V120 M185 0 V120" stroke="#2a2d31" strokeWidth="2.5" />
                  <path d="M-10 110 L90 0" stroke="#3a3d41" strokeWidth="3" />
                  <path d="M70 120 L220 -10" stroke="#c29b38" strokeWidth="2.5" strokeOpacity="0.4" />
                  <path d="M110 120 L240 30" stroke="#3a3d41" strokeWidth="2" />
                  <path d="M20 50 Q110 75 220 40" stroke="#a67f2e" strokeWidth="2" strokeOpacity="0.5" />
                  <rect x="52" y="32" width="48" height="22" rx="3" fill="#2a2d31" fillOpacity="0.75" />
                  <rect x="125" y="72" width="48" height="20" rx="3" fill="#2a2d31" fillOpacity="0.75" />
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                  <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping" />
                  <span className="absolute w-5 h-5 rounded-full bg-rose-500/40 animate-pulse" />
                  <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300 border border-white/20">
                    <MapPin className="w-4 h-4 fill-white text-rose-600" />
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded bg-ink-950/95 border border-ink-800 text-[9px] font-bold text-white tracking-tight shadow-sm whitespace-nowrap">
                    {currentLang === 'ka' ? 'პანორამა \u2022 ოფისი' : currentLang === 'ru' ? 'Офис Panorama' : 'Panorama Office'}
                  </span>
                </div>

                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-ink-900/90 backdrop-blur-xs border border-ink-800/70 text-[9px] text-brass-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Google Maps</span>
                </div>
              </div>

              <div className="p-2.5 bg-ink-900/95 border-t border-ink-800/80 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-brass-400 transition-colors">
                    {t.showroom.addressTbilisi}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {currentLang === 'ka' ? 'დააწკაპუნეთ მარშრუტისთვის' : 'Click to open in Maps'}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-lg bg-ink-800 group-hover:bg-brass-500 text-slate-400 group-hover:text-ink-950 flex items-center justify-center transition-all flex-shrink-0">
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          </div>

          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t.footer.coverageTitle}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t.footer.coverageText}</p>

            <div className="space-y-2.5 pt-2 text-xs">
              <a href="tel:+995599585859" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-brass-400" />
                <span className="font-mono font-semibold">+995 599 58 58 59</span>
              </a>
              <a href="https://wa.me/995599585859" className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">WhatsApp: +995 599 58 58 59</span>
              </a>
              <a href="mailto:support@panorama.ge" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-brass-400" />
                <span>support@panorama.ge</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-mono text-slate-400">{t.footer.regionsBadge}</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-ink-800 hover:bg-ink-800/70 text-slate-300 hover:text-white transition-colors flex items-center space-x-1 shadow-xs"
              id="back-to-top-btn"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-brass-400" />
              <span className="text-[10px] uppercase font-mono">{t.footer.backToTop}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

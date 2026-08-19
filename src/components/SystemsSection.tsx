import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
} from 'lucide-react';
import { Language, SystemListing } from '../types';
import { translations } from '../i18n/translations';
import { CATALOG } from '../data/catalog';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface SystemsSectionProps {
  currentLang: Language;
  openListingId?: string;
  onOpenListingHandled?: () => void;
}

const modalI18n = {
  ka: { closeBtn: 'დახურვა', overviewHeading: 'სისტემის აღწერა & მახასიათებლები' },
  en: { closeBtn: 'Close', overviewHeading: 'Overview & Specifications' },
  ru: { closeBtn: 'Закрыть', overviewHeading: 'Описание и характеристики' },
};

const HEADING_STARTS = ['მთავარი', 'ძირითადი'];
const HEADING_CONTAINS = ['features', 'benefits', 'advantages', 'характеристики', 'преимущества'];

/** Formats the plain-text descriptions with section headers, bold labels
 * and bulleted lines - shared by the description modal below. */
const FormattedDescriptionViewer: React.FC<{ text: string }> = ({ text }) => {
  if (!text || text.trim().length === 0) return null;
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-5 text-slate-700 text-sm leading-relaxed font-normal">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        if (lines.length === 1) {
          const singleLine = lines[0];
          const lower = singleLine.toLowerCase();
          const isHeading =
            HEADING_STARTS.some((s) => singleLine.startsWith(s)) ||
            HEADING_CONTAINS.some((s) => lower.includes(s));
          if (isHeading) {
            return (
              <h4 key={bIdx} className="text-base font-bold text-slate-900 pt-3 pb-1 border-b border-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-brass-500 inline-block" />
                {singleLine}
              </h4>
            );
          }
        }

        return (
          <div key={bIdx} className="space-y-2.5">
            {lines.map((line, lIdx) => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > 0 && colonIndex < 80) {
                const label = line.slice(0, colonIndex).trim();
                const content = line.slice(colonIndex + 1).trim();
                return (
                  <div key={lIdx} className="flex items-start gap-3 bg-slate-50/90 p-3.5 rounded-xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-brass-500 mt-2 shrink-0" />
                    <div className="text-slate-800">
                      <strong className="font-bold text-slate-900 mr-1.5">{label}:</strong>
                      <span className="text-slate-700">{content}</span>
                    </div>
                  </div>
                );
              }
              return <p key={lIdx} className="text-slate-700 leading-relaxed">{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const SystemsSection: React.FC<SystemsSectionProps> = ({
  currentLang,
  openListingId,
  onOpenListingHandled,
}) => {
  const t = translations[currentLang];
  const langText = modalI18n[currentLang] || modalI18n.ka;

  const [listings, setListings] = useState<SystemListing[]>(CATALOG);
  const [activeItem, setActiveItem] = useState<SystemListing | null>(null);
  useModalBehavior(!!activeItem, () => setActiveItem(null));

  // Content can still be updated server-side via the admin-key-gated API
  // (see server.ts) without a redeploy; this just picks up whatever the
  // server currently has, falling back to the committed catalog data.
  useEffect(() => {
    let isMounted = true;
    fetch('/api/listings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.listings) && data.listings.length === CATALOG.length) {
          setListings(data.listings);
        }
      })
      .catch(() => {
        // Static catalog data already in state - nothing else to do.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!openListingId) return;
    const match = listings.find((l) => l.id === openListingId);
    if (match) {
      setActiveItem(match);
      onOpenListingHandled?.();
    }
  }, [openListingId, listings, onOpenListingHandled]);

  return (
    <section
      id="systems"
      className="py-24 bg-slate-50/80 relative border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5 bg-white/95 backdrop-blur-sm rounded-3xl border border-white shadow-sm px-6 py-8 sm:px-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.systemsSection.title}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">{t.systemsSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div
              key={item.id}
              id={`listing-card-${item.slotNumber}`}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-ink-900 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name[currentLang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-ink-900">
                      <FileText className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="p-6 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-brass-700 transition-colors">
                    {item.name[currentLang]}
                  </h3>
                </div>
              </div>

              <div className="p-6 pt-4 flex gap-2.5">
                <button
                  type="button"
                  id={`btn-description-${item.slotNumber}`}
                  onClick={() => setActiveItem(item)}
                  className="flex-1 py-3 px-4 rounded-xl bg-ink-900 hover:bg-brass-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors duration-200 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.systemsSection.viewSpecs}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            id="viewer-description-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="viewer-description-modal-title"
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <h3 id="viewer-description-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeItem.name[currentLang]}
              </h3>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="w-9 h-9 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title={langText.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-ink-900 border border-slate-200 shadow-md aspect-[4/3]">
                    <img src={activeItem.image} alt={activeItem.name[currentLang]} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {langText.overviewHeading}
                    </h4>
                    <FormattedDescriptionViewer text={activeItem.description[currentLang]} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {langText.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

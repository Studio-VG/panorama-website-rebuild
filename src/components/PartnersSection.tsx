import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { partnerBrands } from '../data/company';
import { translations } from '../i18n/translations';

interface PartnersSectionProps {
  currentLang: Language;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 0.5, relY: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, relX: Math.max(0, Math.min(1, x / rect.width)), relY: Math.max(0, Math.min(1, y / rect.height)) });
    if (!isHovered) setIsHovered(true);
  };

  const hueBrass = Math.round(38 + (mousePos.relX - 0.5) * 8);
  const hueGlass = Math.round(176 + (mousePos.relX - 0.5) * 8);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-16 bg-white border-t border-b border-slate-200 relative overflow-hidden"
    >
      {isDesktop && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, hsla(${hueBrass}, 70%, 55%, 0.07), hsla(${hueGlass}, 30%, 45%, 0.04), transparent 70%)`,
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{t.partners.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.partners.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partnerBrands.map((brand, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-brass-400/50 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-1 group"
              id={`partner-brand-${idx}`}
            >
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-brass-700 font-display tracking-wider transition-colors">
                {brand.name}
              </span>
              <span className="text-[11px] text-glass-700 font-mono font-bold">{brand.country}</span>
              <span className="text-[10px] text-slate-500 font-medium">{brand.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

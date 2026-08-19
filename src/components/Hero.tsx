import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sliders } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface HeroProps {
  currentLang: Language;
  onExploreCatalog: () => void;
  onRequestSurvey: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onExploreCatalog,
  onRequestSurvey,
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 0.5, relY: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [panelsOpen, setPanelsOpen] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    // Kick off the panel-slide reveal a beat after mount.
    const t = setTimeout(() => setPanelsOpen(true), 150);
    return () => {
      window.removeEventListener('resize', checkDesktop);
      clearTimeout(t);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = Math.max(0, Math.min(1, x / rect.width));
    const relY = Math.max(0, Math.min(1, y / rect.height));
    setMousePos({ x, y, relX, relY });
    if (!isHovered) setIsHovered(true);
  };

  const shift = (mousePos.relX - 0.5) * 8;
  const hueBrass = Math.round(38 + shift);
  const hueGlass = Math.round(176 + shift);

  const dynamicHeadlineGradient = isDesktop && isHovered
    ? `linear-gradient(90deg, hsl(${hueBrass}, 60%, 34%), hsl(${hueBrass}, 70%, 44%), hsl(${hueGlass}, 30%, 40%))`
    : 'linear-gradient(90deg, #866526, #c29b38, #4a8d87)';

  // Three panel slices that slide open on load, like a guillotine/sliding
  // system opening onto a view - the page's one orchestrated load moment.
  const panelVariants = {
    closed: (i: number) => ({ x: '0%' }),
    open: (i: number) => ({
      x: i === 0 ? '-100%' : i === 2 ? '100%' : '0%',
      opacity: i === 1 ? 0 : 1,
      transition: { duration: 0.85, ease: [0.65, 0, 0.35, 1], delay: i * 0.08 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-[84vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-14 pb-20 border-b border-slate-200"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none flex">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={panelVariants}
              initial="closed"
              animate={panelsOpen ? 'open' : 'closed'}
              className="w-1/3 h-full bg-ink-900 border-r border-brass-500/20 last:border-r-0"
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/user-listings/slot-1.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-15 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/90"></div>
        <div className="absolute inset-0 mullion-grid opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-brass-400/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[400px] h-[300px] bg-glass-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 w-full text-center sm:text-left">
        <div className="space-y-6 max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-black text-slate-950 tracking-tight leading-[1.22] sm:leading-[1.18]">
            <span className="block text-slate-950">{t.hero.titleLine1}</span>
            <span
              className="inline-block mt-2 text-transparent bg-clip-text transition-all duration-300 ease-out font-black pb-2 pt-0.5 max-w-full"
              style={{
                backgroundImage: dynamicHeadlineGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.hero.titleLine2}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-2xl font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="pt-3 flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <button
              onClick={onRequestSurvey}
              className="group px-8 py-4 rounded-xl bg-ink-900 hover:bg-brass-600 active:bg-ink-950 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-3 shadow-xl shadow-ink-900/20 hover:shadow-brass-600/30 transition-all duration-200 cursor-pointer border border-ink-800 hover:border-brass-500"
              id="hero-request-survey-btn"
            >
              <span>{t.hero.ctaQuote}</span>
              <ArrowRight className="w-4 h-4 text-brass-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onExploreCatalog}
              className="px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider border border-slate-300 shadow-sm hover:border-slate-400 hover:shadow-md flex items-center space-x-2 transition-all duration-200 cursor-pointer"
              id="hero-explore-catalog-btn"
            >
              <Sliders className="w-4 h-4 text-brass-600" />
              <span>{t.hero.ctaCatalog}</span>
            </button>
          </div>

        </div>

        <div className="mt-16 pt-10 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto sm:mx-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
              {t.hero.stat1Number}
            </div>
            <p className="text-xs text-slate-600 font-semibold tracking-wide">{t.hero.stat1Label}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brass-300 transition-all space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brass-700 font-mono tracking-tight">
              {t.hero.stat2Number}
            </div>
            <p className="text-xs text-slate-600 font-semibold tracking-wide">{t.hero.stat2Label}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

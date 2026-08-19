import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Ruler,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLangChange,
  activeSection,
  onNavigate,
  onRequestQuote,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'systems', label: t.nav.systems },
    { id: 'contact', label: t.nav.contact },
  ];

  const languages: { code: Language; label: string; badge: string }[] = [
    { code: 'ka', label: 'ქართული', badge: '\u{1F1EC}\u{1F1EA}' },
    { code: 'en', label: 'English', badge: 'EN' },
    { code: 'ru', label: 'Русский', badge: '\u{1F1F7}\u{1F1FA}' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-100/90 text-xs text-slate-600 border-b border-slate-200/90 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-y-1.5">
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-brass-600" />
              <span>{t.showroom.addressTbilisi.split('/')[0]}</span>
            </div>
            <a
              href="tel:+995599585859"
              className="flex items-center space-x-1.5 text-slate-700 hover:text-brass-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brass-600" />
              <span className="font-bold text-slate-900">+995 599 58 58 59</span>
            </a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-2xs transition-colors"
                id="language-selector-button"
              >
                <span className="font-semibold text-xs uppercase text-slate-800 tracking-wide">
                  {languages.find((l) => l.code === currentLang)?.badge}
                </span>
                {currentLang !== 'en' && (
                  <span className="font-semibold text-xs uppercase text-slate-800">{currentLang}</span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLangChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-slate-50 transition-colors ${
                        currentLang === lang.code ? 'text-brass-700 font-bold bg-brass-50' : 'text-slate-700'
                      }`}
                      id={`lang-option-${lang.code}`}
                    >
                      <span className="font-semibold uppercase tracking-wide">{lang.badge}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center space-x-3 group text-left"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-ink-900 flex items-center justify-center p-[1px] shadow-md shadow-ink-900/20 group-hover:scale-105 transition-transform border border-brass-500/40">
              <span className="font-display font-black text-xl text-brass-400 tracking-wider">P</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-extrabold text-lg tracking-[0.16em] text-slate-900 uppercase">
                  {currentLang === 'ka' ? 'პანორამა' : 'PANORAMA'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">
                {t.nav.brandTagline}
              </p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-2.5 xl:px-3.5 py-2 text-[13px] xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeSection === link.id
                    ? 'text-slate-950 bg-slate-100 border border-slate-300 font-bold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onRequestQuote}
              className="flex items-center space-x-2 bg-ink-900 hover:bg-brass-600 active:bg-ink-950 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase shadow-md shadow-ink-900/20 hover:shadow-brass-600/30 transition-all duration-200 cursor-pointer border border-ink-800 hover:border-brass-500"
              id="cta-survey-header-btn"
            >
              <Ruler className="w-3.5 h-3.5 text-brass-400" />
              <span>{t.nav.requestQuote}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
              id="mobile-menu-toggle-btn"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 mt-3 space-y-4 shadow-xl animate-in slide-in-from-top duration-200 max-h-[75vh] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors ${
                    activeSection === link.id
                      ? 'bg-brass-50 text-brass-800 font-bold border border-brass-200'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  id={`mobile-nav-link-${link.id}`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-3">
              <button
                onClick={() => {
                  onRequestQuote();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-ink-900 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md shadow-ink-900/20 border border-ink-800"
                id="mobile-quote-btn"
              >
                <Ruler className="w-4 h-4 text-brass-400" />
                <span>{t.nav.requestQuote}</span>
              </button>

              <a
                href="tel:+995599585859"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-brass-600" />
                <span>+995 599 58 58 59</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

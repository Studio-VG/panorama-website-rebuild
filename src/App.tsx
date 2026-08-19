import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SystemsSection } from './components/SystemsSection';
import { SocialMediaShowcase } from './components/SocialMediaShowcase';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Language } from './types';

const SECTION_IDS = ['home', 'systems', 'contact'];

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ka');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [openListingId, setOpenListingId] = useState<string | undefined>(undefined);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTION_IDS) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 200) setActiveSection('home');
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectProductFromFooter = useCallback((productId: string) => {
    setOpenListingId(productId);
    scrollToSection('systems');
  }, [scrollToSection]);

  const handleOpenListingHandled = useCallback(() => setOpenListingId(undefined), []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brass-500 selection:text-white font-sans antialiased overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[45]"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, hsla(38, 75%, 55%, 0.07), hsla(176, 30%, 45%, 0.04), transparent 70%)`,
        }}
      />

      <Navbar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onRequestQuote={() => scrollToSection('contact')}
      />

      <main id="home" className="relative z-10">
        <Hero
          currentLang={currentLang}
          onExploreCatalog={() => scrollToSection('systems')}
          onRequestSurvey={() => scrollToSection('contact')}
        />

        <SystemsSection
          currentLang={currentLang}
          openListingId={openListingId}
          onOpenListingHandled={handleOpenListingHandled}
        />

        <SocialMediaShowcase currentLang={currentLang} />

        <ContactSection currentLang={currentLang} />
      </main>

      <Footer
        currentLang={currentLang}
        onNavigate={scrollToSection}
        onSelectProduct={handleSelectProductFromFooter}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { faqsData } from '../data/company';
import { translations } from '../i18n/translations';

interface TestimonialsAndFAQProps {
  currentLang: Language;
}

export const TestimonialsAndFAQ: React.FC<TestimonialsAndFAQProps> = ({ currentLang }) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const t = translations[currentLang];

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-slate-50/60 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div id="faq">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-50 border border-brass-200/80 text-xs font-semibold text-brass-900 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-brass-600" />
              <span>{t.faq.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.faq.title}</h2>
            <p className="text-sm sm:text-base text-slate-600">{t.faq.subtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqsData.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs hover:border-slate-300">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                    id={`faq-toggle-${idx}`}
                  >
                    <span className="font-bold text-slate-900 text-base sm:text-lg">{faq.question[currentLang]}</span>
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-ink-900 text-white' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 text-left animate-in fade-in duration-150">
                      {faq.answer[currentLang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

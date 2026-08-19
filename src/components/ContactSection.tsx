import React from 'react';
import { Phone, MapPin, MessageSquare, Clock, Mail } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ContactSectionProps {
  currentLang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section
      id="contact"
      className="py-20 bg-slate-50 relative border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{t.contact.title}</h2>
          <p className="text-sm sm:text-base text-slate-600">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-brass-50 border border-brass-200 flex items-center justify-center text-brass-700">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">{t.contact.hotlineTag}</span>
              <h3 className="text-lg font-black text-slate-950 font-mono">+995 599 58 58 59</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{t.contact.hotlineDesc}</p>
            </div>
            <a
              href="tel:+995599585859"
              className="w-full py-3 px-4 rounded-xl bg-ink-900 hover:bg-brass-600 text-white text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md border border-ink-800 hover:border-brass-500 uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 text-brass-400" />
              <span>{t.contact.callNowBtn}</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-emerald-400/80 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">{t.contact.chatTag}</span>
              <h3 className="text-lg font-black text-slate-950">WhatsApp & Viber</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{t.contact.chatDesc}</p>
            </div>
            <a
              href="https://wa.me/995599585859?text=Hello%20Panorama!%20I%20would%20like%20to%20consult%20on%20an%20aluminum%20and%20glass%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md uppercase tracking-wider"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.contact.whatsappBtn}</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">{t.contact.emailTag}</span>
              <h3 className="text-lg font-black text-slate-950">support@panorama.ge</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{t.contact.emailDesc}</p>
            </div>
            <a
              href="mailto:support@panorama.ge"
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all border border-slate-200 uppercase tracking-wider"
            >
              <Mail className="w-3.5 h-3.5 text-brass-600" />
              <span>{t.contact.emailBtn}</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-brass-600" />
              <span>{t.contact.hqTitle}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">{t.contact.hqAddress}</p>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm pt-1">
              <Clock className="w-4 h-4 text-brass-600" />
              <span>{t.contact.workingHoursTitle}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{t.contact.workingHoursDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

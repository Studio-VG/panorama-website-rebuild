import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Check,
  ArrowRight,
  Building,
  Calendar
} from 'lucide-react';
import { Language, ShowroomLocation } from '../types';
import { showroomsData } from '../data/company';
import { translations } from '../i18n/translations';

interface ShowroomSectionProps {
  currentLang: Language;
  onBookVisit: (showroomCity: string) => void;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  currentLang,
  onBookVisit,
}) => {
  const [selectedShowroom, setSelectedShowroom] = useState<ShowroomLocation>(showroomsData[0]);
  const t = translations[currentLang];

  return (
    <section id="showroom" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-50 border border-brass-200/80 text-xs font-semibold text-brass-900 shadow-xs">
            <Building className="w-3.5 h-3.5 text-brass-600" />
            <span>{t.showroom.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.showroom.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">{t.showroom.subtitle}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-2xl">
            {showroomsData.map((sh) => (
              <button
                key={sh.id}
                onClick={() => setSelectedShowroom(sh)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                  selectedShowroom.id === sh.id
                    ? 'bg-ink-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`showroom-tab-${sh.id}`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{sh.name[currentLang]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-md bg-brass-50 text-brass-900 text-xs font-mono font-bold uppercase tracking-wider border border-brass-200/80">
                    {selectedShowroom.city[currentLang]} {t.showroom.flagshipBadge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    {selectedShowroom.name[currentLang]}
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <MapPin className="w-5 h-5 text-brass-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-500 block">{t.showroom.addressLabel}</span>
                      <span className="font-semibold text-slate-900">{selectedShowroom.address[currentLang]}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <Clock className="w-5 h-5 text-brass-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-500 block">{t.showroom.hoursLabel}</span>
                      <span className="font-semibold text-slate-900">{selectedShowroom.hours[currentLang]}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`tel:${selectedShowroom.phone.replace(/[^+\d]/g, '')}`}
                      className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 p-3.5 rounded-xl border border-slate-200/80 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-brass-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.showroom.phoneLabel}</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">{selectedShowroom.phone}</span>
                      </div>
                    </a>

                    <a
                      href={`mailto:${selectedShowroom.email}`}
                      className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 p-3.5 rounded-xl border border-slate-200/80 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-brass-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.showroom.emailLabel}</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">{selectedShowroom.email}</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                    {t.showroom.experienceTitle}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.showroom.expItem1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.showroom.expItem2}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.showroom.expItem3}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.showroom.expItem4}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onBookVisit(selectedShowroom.city[currentLang])}
                  className="px-6 py-3 rounded-xl bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md transition-all"
                  id="book-showroom-visit-btn"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.showroom.bookVisit}</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${selectedShowroom.coordinates.lat},${selectedShowroom.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs border border-slate-200 flex items-center space-x-2 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-brass-600" />
                  <span>{t.showroom.getDirections}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-full bg-slate-100">
              <img
                src={selectedShowroom.image}
                alt={selectedShowroom.name[currentLang]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brass-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedShowroom.city[currentLang]} {t.showroom.coordinatesTitle}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600">
                      {selectedShowroom.coordinates.lat.toFixed(4)}\u00b0 N, {selectedShowroom.coordinates.lng.toFixed(4)}\u00b0 E
                    </span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedShowroom.coordinates.lat},${selectedShowroom.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                >
                  Google Maps \u2197
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Wrench, Cpu, ShieldCheck, Layers, Compass, ArrowRight, Factory } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface EngineeringSectionProps {
  currentLang: Language;
  onRequestQuote: () => void;
}

export const EngineeringSection: React.FC<EngineeringSectionProps> = ({ currentLang, onRequestQuote }) => {
  const t = translations[currentLang];

  const steps = [
    { number: '01', title: t.engineering.step1Title, desc: t.engineering.step1Desc, icon: Compass, tag: 'Millimetric 3D Laser' },
    { number: '02', title: t.engineering.step2Title, desc: t.engineering.step2Desc, icon: Layers, tag: 'Eurocode Calculations' },
    { number: '03', title: t.engineering.step3Title, desc: t.engineering.step3Desc, icon: Cpu, tag: 'German Elumatec CNC' },
    { number: '04', title: t.engineering.step4Title, desc: t.engineering.step4Desc, icon: Wrench, tag: 'Certified Vacuum Lifters' },
    { number: '05', title: t.engineering.step5Title, desc: t.engineering.step5Desc, icon: ShieldCheck, tag: '10-Year Guarantee' },
  ];

  const colorSchemes = [
    { num: 'text-brass-700', tag: 'text-brass-800 bg-brass-50 border-brass-200', icon: 'text-brass-700 bg-brass-50' },
    { num: 'text-glass-700', tag: 'text-glass-700 bg-glass-50 border-glass-200', icon: 'text-glass-700 bg-glass-50' },
    { num: 'text-teal-700', tag: 'text-teal-800 bg-teal-50 border-teal-200', icon: 'text-teal-700 bg-teal-50' },
    { num: 'text-amber-700', tag: 'text-amber-800 bg-amber-50 border-amber-200', icon: 'text-amber-700 bg-amber-50' },
    { num: 'text-emerald-700', tag: 'text-emerald-800 bg-emerald-50 border-emerald-200', icon: 'text-emerald-700 bg-emerald-50' },
  ];

  return (
    <section id="engineering" className="py-20 bg-slate-100/90 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brass-50 border border-brass-200 text-xs font-semibold text-brass-800 shadow-xs">
            <Factory className="w-3.5 h-3.5 text-brass-600" />
            <span>{t.engineering.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{t.engineering.title}</h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">{t.engineering.subtitle}</p>
        </div>

        <div className="bg-ink-950 rounded-3xl border border-ink-800 p-8 sm:p-10 mb-16 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute inset-0 mullion-grid-dark pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentLang === 'ka'
                  ? 'სრული ტექნოლოგიური ციკლი თბილისში'
                  : currentLang === 'ru'
                  ? 'Полный производственный цикл в Тбилиси'
                  : 'Full-Cycle Engineering Facility in Tbilisi'}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentLang === 'ka'
                  ? 'ჩვენ არ ვართ შუამავალი. Panorama ფლობს საკუთარ 2,500 მ² ქარხანას თბილისში, სადაც 5-ღერძიანი გერმანული CNC ჩარხებით მუშავდება ალუმინის პროფილები, ხორციელდება თერმოხიდის პრესირება და ფხვნილოვანი შეღებვა ნებისმიერ RAL ფერში.'
                  : currentLang === 'ru'
                  ? 'Мы не являемся посредниками. Panorama располагает собственным заводом площадью 2500 м² в Тбилиси с 5-осевыми обрабатывающими центрами CNC, линией порошковой покраски Qualicoat и складом европейских комплектующих.'
                  : 'We operate our own 2,500 m² advanced fabrication plant in Tbilisi equipped with 5-axis CNC processing centers, automated thermal break insertion lines, and certified Qualicoat electrostatic powder coating.'}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-ink-900/90 p-4 rounded-xl border border-ink-800">
                  <span className="text-2xl font-black text-white font-mono block">\u00b10.1 mm</span>
                  <span className="text-xs text-slate-400 font-medium">CNC Cutting Accuracy</span>
                </div>
                <div className="bg-ink-900/90 p-4 rounded-xl border border-ink-800">
                  <span className="text-2xl font-black text-brass-400 font-mono block">15-25 Days</span>
                  <span className="text-xs text-slate-400 font-medium">Turn-Key Lead Time</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-ink-800 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
                  alt="Panorama CNC Fabrication Plant Tbilisi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                  <span className="font-mono text-glass-400 font-bold block uppercase">Tbilisi CNC Processing Plant</span>
                  <span className="text-slate-300">Cherkezishvili St Industrial Zone</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-left mb-6">
            <h3 className="text-xl font-extrabold text-slate-950">
              {currentLang === 'ka'
                ? 'პროექტის შესრულების 5-ეტაპიანი სტანდარტი'
                : currentLang === 'ru'
                ? '5 этапов реализации проекта под ключ'
                : 'Our 5-Stage Turn-Key Project Methodology'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const scheme = colorSchemes[idx % colorSchemes.length];
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col justify-between space-y-4 relative group hover:shadow-xl hover:border-slate-300 transition-all shadow-xs text-left" id={`step-card-${idx + 1}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono font-black text-2xl ${scheme.num}`}>{step.number}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${scheme.icon}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-sm">{step.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block px-2 py-0.5 rounded-md border text-center ${scheme.tag}`}>{step.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onRequestQuote}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-ink-900 hover:bg-brass-600 active:bg-ink-950 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer border border-ink-800 hover:border-brass-500"
            id="eng-cta-quote-btn"
          >
            <span>{t.contact.title}</span>
            <ArrowRight className="w-4 h-4 text-brass-400" />
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language, Currency } from '../types';
import { CATALOG } from '../data/catalog';
import { translations } from '../i18n/translations';

interface CostCalculatorProps {
  currentLang: Language;
  currentCurrency: Currency;
  preselectedSystemId?: string;
  onProceedToQuote: (calcData: {
    systemName: string;
    width: number;
    height: number;
    area: number;
    glassType: string;
    automationType: string;
    estimatedMin: number;
    estimatedMax: number;
    currency: Currency;
  }) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  currentLang,
  currentCurrency,
  preselectedSystemId,
  onProceedToQuote,
}) => {
  const t = translations[currentLang];

  const [selectedSystemId, setSelectedSystemId] = useState<string>(preselectedSystemId || CATALOG[0].id);
  const [width, setWidth] = useState<number>(6.0);
  const [height, setHeight] = useState<number>(3.0);
  const [glassType, setGlassType] = useState<'standard' | 'triple' | 'solar' | 'triplex'>('triple');
  const [automation, setAutomation] = useState<'none' | 'smart' | 'sensors'>('smart');

  useEffect(() => {
    if (preselectedSystemId) setSelectedSystemId(preselectedSystemId);
  }, [preselectedSystemId]);

  const selectedProduct = CATALOG.find((p) => p.id === selectedSystemId) || CATALOG[0];
  const area = Math.round(width * height * 10) / 10;

  const glassMultipliers = { standard: 1.0, triple: 1.18, solar: 1.25, triplex: 1.22 };
  const automationAddons = {
    none: 0,
    smart: currentCurrency === 'GEL' ? 1400 : currentCurrency === 'USD' ? 520 : 480,
    sensors: currentCurrency === 'GEL' ? 2200 : currentCurrency === 'USD' ? 820 : 750,
  };

  const baseRate = selectedProduct.startingPricePerM2[currentCurrency];
  const glassMultiplier = glassMultipliers[glassType];
  const addon = automationAddons[automation];

  const estimatedMin = Math.round(area * baseRate * glassMultiplier + addon);
  const estimatedMax = Math.round(estimatedMin * 1.22);

  const currencySymbol = currentCurrency === 'GEL' ? '\u20be' : currentCurrency === 'USD' ? '$' : '\u20ac';

  const handleApplyToQuote = () => {
    const glassLabels = {
      standard: t.calculator.glassStandard,
      triple: t.calculator.glassTriple,
      solar: t.calculator.glassSolar,
      triplex: t.calculator.glassTemperedLami,
    };
    const autoLabels = { none: t.calculator.motorizationNone, smart: t.calculator.motorizationSmart, sensors: t.calculator.motorizationSensors };

    onProceedToQuote({
      systemName: selectedProduct.name[currentLang],
      width,
      height,
      area,
      glassType: glassLabels[glassType],
      automationType: autoLabels[automation],
      estimatedMin,
      estimatedMax,
      currency: currentCurrency,
    });
  };

  return (
    <section id="calculator" className="py-20 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-50 border border-brass-200/80 text-xs font-semibold text-brass-900 shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-brass-600" />
            <span>{t.calculator.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.calculator.title}</h2>
          <p className="text-sm sm:text-base text-slate-600">{t.calculator.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-white font-mono flex items-center justify-center text-xs">1</span>
                  <span>{t.calculator.step1}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {CATALOG.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedSystemId(prod.id)}
                      className={`p-3 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                        selectedSystemId === prod.id
                          ? 'bg-brass-50 border-brass-300 text-slate-900 shadow-xs font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                      }`}
                      id={`calc-system-${prod.id}`}
                    >
                      <span className="line-clamp-2">{prod.name[currentLang]}</span>
                      <span className="text-[10px] font-mono text-brass-800 mt-2 font-bold">
                        {currencySymbol} {prod.startingPricePerM2[currentCurrency]}/{t.systemsSection.perM2}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-white font-mono flex items-center justify-center text-xs">2</span>
                  <span>{t.calculator.step2}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">{t.calculator.widthLabel}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{width.toFixed(1)} m</span>
                    </div>
                    <input type="range" min="1.5" max="18.0" step="0.1" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} className="w-full accent-brass-600 cursor-pointer" id="calc-slider-width" />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>1.5m</span><span>10m</span><span>18.0m</span></div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">{t.calculator.heightLabel}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{height.toFixed(1)} m</span>
                    </div>
                    <input type="range" min="1.0" max="4.5" step="0.1" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} className="w-full accent-brass-600 cursor-pointer" id="calc-slider-height" />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>1.0m</span><span>2.8m</span><span>4.5m</span></div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-600 font-medium">{t.calculator.totalArea}:</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{area} m² ({width.toFixed(1)}m × {height.toFixed(1)}m)</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-white font-mono flex items-center justify-center text-xs">3</span>
                  <span>{t.calculator.step3}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {([
                    ['standard', t.calculator.glassStandard],
                    ['triple', t.calculator.glassTriple],
                    ['solar', t.calculator.glassSolar],
                    ['triplex', t.calculator.glassTemperedLami],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setGlassType(key)}
                      className={`p-3 rounded-xl text-left text-xs transition-all border flex items-start space-x-2.5 ${
                        glassType === key ? 'bg-brass-50 border-brass-300 text-slate-900 shadow-xs font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                      }`}
                      id={`glass-opt-${key}`}
                    >
                      <ShieldCheck className="w-4 h-4 text-brass-600 shrink-0 mt-0.5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-white font-mono flex items-center justify-center text-xs">4</span>
                  <span>{t.calculator.step4}</span>
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setAutomation('none')}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${automation === 'none' ? 'bg-brass-50 border-brass-300 text-slate-900 shadow-xs font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'}`}
                    id="auto-opt-none"
                  >
                    <span>{t.calculator.motorizationNone}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{t.calculator.included}</span>
                  </button>
                  <button
                    onClick={() => setAutomation('smart')}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${automation === 'smart' ? 'bg-brass-50 border-brass-300 text-slate-900 shadow-xs font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'}`}
                    id="auto-opt-smart"
                  >
                    <div className="flex items-center space-x-2"><Zap className="w-3.5 h-3.5 text-brass-600" /><span>{t.calculator.motorizationSmart}</span></div>
                    <span className="text-brass-800 font-mono font-bold text-[11px]">+{currencySymbol}{automationAddons.smart}</span>
                  </button>
                  <button
                    onClick={() => setAutomation('sensors')}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${automation === 'sensors' ? 'bg-brass-50 border-brass-300 text-slate-900 shadow-xs font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'}`}
                    id="auto-opt-sensors"
                  >
                    <div className="flex items-center space-x-2"><Zap className="w-3.5 h-3.5 text-brass-600" /><span>{t.calculator.motorizationSensors}</span></div>
                    <span className="text-brass-800 font-mono font-bold text-[11px]">+{currencySymbol}{automationAddons.sensors}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold uppercase tracking-wider">{t.calculator.dimensionScaledPreview}</span>
                  <span className="font-mono font-bold text-slate-900">{width.toFixed(1)}m × {height.toFixed(1)}m</span>
                </div>
                <div className="relative w-full h-44 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-4 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${Math.min(100, (width / 18) * 100 + 35)}%`, height: `${Math.min(100, (height / 4.5) * 100 + 40)}%` }}
                    className="border-2 border-ink-900 bg-ink-900/10 rounded-md relative flex items-center justify-center transition-all duration-300 shadow-xs"
                  >
                    <div className="absolute inset-0 grid grid-cols-3 divide-x divide-ink-900/20"><div></div><div></div><div></div></div>
                    <span className="relative z-10 text-[11px] font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">{area} m²</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
                  <div className="flex justify-between"><span className="text-slate-500">{t.calculator.systemLabel}</span><span className="font-semibold text-slate-900 truncate max-w-[200px] text-right">{selectedProduct.name[currentLang]}</span></div>
                  {selectedProduct.profilePartners.length > 0 && (
                    <div className="flex justify-between"><span className="text-slate-500">{t.calculator.profileBrandLabel}</span><span className="font-mono font-bold text-slate-900">{selectedProduct.profilePartners.join(' / ')}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-slate-500">{t.calculator.thermalRatingLabel}</span><span className="font-mono font-bold text-emerald-700">{selectedProduct.specs.thermalInsulation}</span></div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-ink-900 text-white border border-ink-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{t.calculator.estimatedRange}</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {currencySymbol} {estimatedMin.toLocaleString()} \u2013 {estimatedMax.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-brass-300 font-mono font-medium block mt-1">
                    \u2248 {currencySymbol} {Math.round(estimatedMin / area)} / m² ({t.calculator.turnKeyNote})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{t.calculator.note}</p>
                <button
                  onClick={handleApplyToQuote}
                  className="w-full py-4 px-4 rounded-xl bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
                  id="calc-submit-cta-btn"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{t.calculator.submitForDrawing}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Maximize2,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ProjectItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  currentLang: Language;
  onClose: () => void;
  onRequestQuote: (projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentLang,
  onClose,
  onRequestQuote,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  useModalBehavior(!!project, onClose);

  if (!project) return null;

  const t = translations[currentLang];
  const hasBeforeAfter = !!project.beforeAfterImage;

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(newPos);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-left"
        id="project-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-md transition-all z-20"
          id="close-project-modal-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {hasBeforeAfter && project.beforeAfterImage ? (
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-100 select-none">
            <div
              className="relative w-full h-full cursor-ew-resize overflow-hidden"
              onMouseMove={(e) => isDragging && handleSliderMove(e)}
              onTouchMove={(e) => handleSliderMove(e)}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onClick={handleSliderMove}
            >
              <img
                src={project.beforeAfterImage.after}
                alt="Installed Panorama Glass System"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                style={{ width: `${sliderPosition}%` }}
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-ink-900 shadow-2xl"
              >
                <img
                  src={project.beforeAfterImage.before}
                  alt="Before Panorama Installation"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-ink-900/90 text-white text-[10px] font-mono uppercase tracking-wider font-bold border border-slate-700 shadow-md">
                  {t.projects.beforeInstall}
                </span>
              </div>

              <span className="absolute top-4 right-4 px-3 py-1 rounded-md bg-brass-500 text-slate-950 text-[10px] font-mono uppercase tracking-wider font-bold shadow-md">
                {t.projects.afterInstall}
              </span>

              <div
                style={{ left: `${sliderPosition}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-ink-900 text-white shadow-2xl flex items-center justify-center pointer-events-none border-2 border-white"
              >
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-xs">
              {t.projects.sliderHint}
            </div>
          </div>
        ) : (
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-100">
            <img
              src={project.image}
              alt={project.title[currentLang]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent"></div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-2">
              <span className="flex items-center space-x-1 text-brass-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-brass-600" />
                <span>{project.location[currentLang]}</span>
              </span>
              <span>\u2022</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{project.year}</span>
              </span>
              <span>\u2022</span>
              <span className="flex items-center space-x-1">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{project.area}</span>
              </span>
              {project.architect && (
                <>
                  <span>\u2022</span>
                  <span className="text-slate-600 font-mono">Arch: {project.architect}</span>
                </>
              )}
            </div>

            <h2 id="project-detail-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {project.title[currentLang]}
            </h2>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {project.description[currentLang]}
          </p>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-brass-600" />
              <span>{t.projects.systemsInstalled}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.systemsUsed.map((sys, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {sys}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brass-600" />
              <span>{t.projects.deliverablesTitle}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {project.highlightSpecs[currentLang].map((spec, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600 font-medium">
            <span>{t.projects.wantSimilar}</span>
          </div>

          <button
            onClick={() => {
              onRequestQuote(project.title[currentLang]);
              onClose();
            }}
            className="px-6 py-3 rounded-xl bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xs transition-all"
            id="modal-project-quote-btn"
          >
            <span>{t.projects.requestConsultation}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

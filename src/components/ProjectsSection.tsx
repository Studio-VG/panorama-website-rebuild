import React, { useState } from 'react';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { ProjectItem, Language } from '../types';
import { projectsData } from '../data/projects';
import { translations } from '../i18n/translations';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsSectionProps {
  currentLang: Language;
  onRequestQuote: (projectName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  currentLang,
  onRequestQuote,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const t = translations[currentLang];

  const filterTabs = [
    { id: 'all', label: t.projects.filterAll },
    { id: 'Tbilisi', label: t.projects.filterTbilisi },
    { id: 'Batumi', label: t.projects.filterBatumi },
    { id: 'Kakheti', label: t.projects.filterKakheti },
    { id: 'villa', label: t.projects.filterVilla },
    { id: 'commercial', label: t.projects.filterCommercial },
    { id: 'penthouse', label: t.projects.filterPenthouse },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(
        (p) => p.city === activeFilter || p.category === activeFilter
      );

  return (
    <section id="projects" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-50 border border-brass-200/80 text-xs font-semibold text-brass-900 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-brass-600" />
            <span>{t.projects.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">{t.projects.subtitle}</p>
        </div>

        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-ink-900 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs'
              }`}
              id={`proj-filter-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer text-left"
              onClick={() => setSelectedProject(project)}
              id={`project-card-${project.id}`}
            >
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title[currentLang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shadow-xs flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brass-600" />
                      <span>{project.city}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                    <span className="font-mono font-bold">{project.area} \u2022 {t.projects.glazingArea}</span>
                    <span className="font-mono text-slate-300">{project.year}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brass-700 transition-colors leading-snug">
                    {project.title[currentLang]}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.description[currentLang]}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.systemsUsed.slice(0, 2).map((sys, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-semibold group-hover:text-slate-900 transition-colors">
                  <span>{t.projects.viewDetails}</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-ink-900 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          currentLang={currentLang}
          onClose={() => setSelectedProject(null)}
          onRequestQuote={onRequestQuote}
        />
      )}
    </section>
  );
};

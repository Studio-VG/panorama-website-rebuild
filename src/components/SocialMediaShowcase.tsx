import React, { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { TIKTOK_VIDEOS } from '../data/tiktok';
import { publicAsset } from '../lib/publicAsset';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.93-4.47V8.62a8.27 8.27 0 0 0 4.84 1.55V6.69h-1z" />
  </svg>
);

interface SocialMediaShowcaseProps {
  currentLang: Language;
}

export const SocialMediaShowcase: React.FC<SocialMediaShowcaseProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [videos, setVideos] = useState(TIKTOK_VIDEOS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/tiktok')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch(() => {
        // Committed video data already in state - nothing else to do.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="showcase" className="py-24 sm:py-32 bg-ink-950 text-white relative overflow-hidden border-b border-ink-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(194,155,56,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 mullion-grid-dark [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-8 border-b border-ink-800/80">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t.socialShowcase.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-light">{t.socialShowcase.subtitle}</p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://www.tiktok.com/@panorama_glass"
              target="_blank"
              rel="noopener noreferrer"
              id="tiktok-channel-cta"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold text-sm shadow-xl shadow-black/40 hover:shadow-brass-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="w-7 h-7 rounded-xl bg-ink-900 text-white flex items-center justify-center group-hover:bg-brass-600 transition-colors">
                <TikTokIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="leading-none text-slate-900 font-extrabold">{t.socialShowcase.followTikTok}</span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5">{t.socialShowcase.channelHandle}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all ml-1" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              id={`tiktok-video-card-${video.id}`}
              className="group relative rounded-2xl overflow-hidden bg-ink-900 border border-ink-800 shadow-2xl hover:border-brass-500/50 hover:shadow-brass-900/10 transition-all duration-500 flex flex-col"
            >
              <div className="relative w-full aspect-[9/16] overflow-hidden bg-ink-950">
                <img
                  src={video.thumbnail}
                  alt={video.title[currentLang] || video.title.ka}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = publicAsset(`/tiktok/video-${video.id}.jpg`);
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-brass-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/90 group-hover:bg-brass-500 text-slate-950 shadow-2xl flex items-center justify-center transform group-hover:scale-115 transition-all duration-300 backdrop-blur-xs ring-4 ring-white/20 group-hover:ring-brass-400/40">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 transition-transform group-hover:scale-105" />
                  </div>
                </a>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-2 pointer-events-none z-10 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-brass-300 transition-colors drop-shadow-md">
                    {video.title[currentLang] || video.title.ka}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

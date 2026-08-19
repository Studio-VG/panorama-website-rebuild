import React, { useState } from 'react';
import { CheckCircle2, X, Phone, MessageCircle, Copy, Check } from 'lucide-react';
import { InquiryResponse, Language } from '../types';
import { translations } from '../i18n/translations';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface InquirySuccessModalProps {
  inquiryResult: InquiryResponse | null;
  currentLang: Language;
  onClose: () => void;
}

export const InquirySuccessModal: React.FC<InquirySuccessModalProps> = ({
  inquiryResult,
  currentLang,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[currentLang];
  const isVisible = !!inquiryResult?.success && !!inquiryResult?.details;
  useModalBehavior(isVisible, onClose);

  if (!isVisible || !inquiryResult?.details) return null;
  const details = inquiryResult.details;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(details.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Panorama! I submitted an inquiry [${details.referenceNumber}] for ${details.serviceType} in ${details.city}. Looking forward to discussing details.`
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center text-slate-900"
        id="inquiry-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-success-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all"
          id="close-success-modal-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h3 id="inquiry-success-modal-title" className="text-2xl font-extrabold text-slate-900">{t.contact.successTitle}</h3>
          <p className="text-xs text-slate-600">{t.contact.successDesc}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">{t.contact.successRef}</span>
            <span className="text-xl font-mono font-black text-brass-800">{details.referenceNumber}</span>
          </div>

          <button
            onClick={handleCopyRef}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors flex items-center space-x-1 text-xs"
            id="copy-ref-btn"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span className="font-mono">{copied ? t.contact.modalCopied : t.contact.modalCopy}</span>
          </button>
        </div>

        <div className="text-xs text-left bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">{t.contact.modalClient}</span>
            <span className="font-semibold text-slate-900">{details.name} ({details.phone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.contact.modalLocation}</span>
            <span className="text-slate-900 font-medium">{details.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.contact.modalResponse}</span>
            <span className="text-emerald-700 font-mono font-bold">{details.estimatedResponseTime}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={`https://wa.me/995599585859?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.contact.modalWhatsApp}</span>
          </a>

          <a
            href="tel:+995599585859"
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs border border-slate-200 flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 text-brass-600" />
            <span>{t.contact.modalHotline}</span>
          </a>
        </div>

        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800 underline">
          {t.contact.modalClose}
        </button>
      </div>
    </div>
  );
};

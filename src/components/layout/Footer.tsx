import React from 'react';
import { Layers, ShieldCheck, ArrowUp } from 'lucide-react';

export interface FooterProps {
  onOpenArchitectureModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitectureModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else scrollToTop();
  };

  return (
    <footer className="mt-20 border-t border-slate-200/90 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center text-white font-extrabold shadow-2xs border border-teal-700">
                <span className="font-mono text-xs tracking-tighter text-teal-200">P</span>
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                PRICERA
              </span>
            </div>
            <p className="text-sm font-medium text-slate-700">
              Know the market before you buy.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Evidence-backed product and material price discovery platform. Structured specification parsing, authentic catalog research, and transparent market benchmarks.
            </p>
          </div>

          {/* Quick Navigation Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('search')}
                  className="hover:text-teal-800 transition-colors cursor-pointer"
                >
                  Product Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-teal-800 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('spotlight')}
                  className="hover:text-teal-800 transition-colors cursor-pointer"
                >
                  Market Spotlight
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenArchitectureModal}
                  className="hover:text-teal-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-semibold text-teal-700"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Technical Architecture</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Integrity Principles Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transparency Standard
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                <span>Zero fabricated prices or artificial citations</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                <span>Statistical median benchmarks with outlier filtering</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                <span>Text-first search with zero computer vision claims</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            <strong>Market Notice:</strong> PRICERA generates benchmark price estimates based on available observations. Estimates are evidence indicators for purchasing intelligence and do not guarantee final supplier transaction prices, freight costs, or municipal sales taxes.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer shrink-0"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Layers, ArrowUp, ShieldCheck } from 'lucide-react';

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
    <footer className="mt-24 border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-extrabold shadow-sm border border-teal-600/40">
                <span className="font-mono text-sm tracking-tighter text-teal-100">P</span>
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-xl">
                PRICERA
              </span>
            </div>
            <p className="text-base font-bold text-slate-900 tracking-tight">
              Know the market before you buy.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Evidence-backed product and material price discovery.
            </p>

            {/* Transparency statement */}
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>No fabricated prices. No artificial citations. Evidence first.</span>
            </div>
          </div>

          {/* Navigation Links Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('search')}
                  className="hover:text-teal-800 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-teal-800 transition-colors cursor-pointer"
                >
                  How it works
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
                  className="hover:text-teal-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800 text-xs"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Technical Architecture</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Research Principles Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Research Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
              <li>• Real commercial and distributor sources</li>
              <li>• Transparent confidence ratings</li>
              <li>• Verified units of measure & specifications</li>
              <li>• Refusal to fabricate synthetic quotes</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© 2026 PRICERA. All rights reserved.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-600 hover:text-teal-800 transition-colors cursor-pointer font-medium"
            title="Scroll to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

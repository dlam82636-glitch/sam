import React from 'react';
import { ShieldCheck, Info, FileText } from 'lucide-react';

export interface FooterProps {
  onOpenArchitectureModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitectureModal }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-slate-900 tracking-tight">MarketSpec</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">MVP Foundation</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-sm">
              An engineering-grade search platform for researching physical goods, building materials, and industrial equipment with structured specifications and transparent price intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Design Principles
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero unsupported AI estimates: prices require sources</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Text-only interaction: fast, clean, and distraction-free</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Modular service abstraction for future backend stages</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              System Blueprint
            </h4>
            <p className="text-xs text-slate-700 mb-3 leading-relaxed">
              Stage 1 & 2 establish technical contracts, clean folder structure, and UI foundation. Live AI and web search services will be enabled in subsequent stages.
            </p>
            <button
              onClick={onOpenArchitectureModal}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Review Technical Architecture Doc</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Prototype Demonstration: All displayed numbers in Stage 1/2 are synthetic fixtures.</span>
          </div>
          <div>Built with strict separation of presentation and intelligence pipelines.</div>
        </div>
      </div>
    </footer>
  );
};

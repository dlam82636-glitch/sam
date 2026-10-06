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
              <span className="font-extrabold text-slate-900 tracking-tight text-base">PRICERA</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-mono border border-teal-200">
                Market Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              <strong>Know the market before you buy.</strong> PRICERA is an evidence-driven product and material research platform providing structured specification parsing and transparent market price bounds.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Core Principles
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Zero fabricated prices or artificial sources</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Transparent median calculations & outlier screening</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Clean text-first interaction without distractions</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              System Roadmap
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Prompts 1–6 active: Query Understanding, Product Research Layer, and Pricing Intelligence Engine are operational.
            </p>
            <button
              onClick={onOpenArchitectureModal}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Review Technical Architecture Doc</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>PRICERA Engine: Understand · Research · Compare · Estimate</span>
          </div>
          <div className="font-mono text-[11px]">Strict separation of evidence and statistical estimates.</div>
        </div>
      </div>
    </footer>
  );
};

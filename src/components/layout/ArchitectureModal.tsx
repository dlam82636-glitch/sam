import React from 'react';
import { X, CheckCircle2, ArrowRight, Layers, ShieldCheck, Server, Database, Sparkles, Globe, Calculator, AlertTriangle } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

export interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="architecture-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 id="architecture-modal-title" className="font-semibold text-slate-900 text-base">
                System Architecture & Stage Roadmap
              </h3>
              <p className="text-xs text-slate-700">
                Specification for MarketSpec text-search product intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close architecture modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Current Stage Status Notice */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-teal-950 text-xs uppercase tracking-wider mb-1">
                Current Scope: Prompts 1–6 Complete (PRICERA Engine Live)
              </h4>
              <p className="text-xs text-teal-900/90 leading-relaxed">
                The full four-stage PRICERA engine (Understand → Research → Compare → Estimate) is active. User queries are validated, structured by Gemini into technical specs, processed through the Product Research Layer across commercial catalogs, and evaluated by the Pricing Intelligence Engine with median estimates and documented limitations.
              </p>
            </div>
          </div>

          {/* End-to-End Data Flow */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Proposed Pipeline Data Flow
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-medium">
                <span>[1] User Query (Text)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span>Client Validation (Sanitization, Bounds)</span>
              </div>
              <div className="pl-4 border-l-2 border-indigo-200 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>[2] Server Research Coordinator Request</span>
              </div>
              <div className="pl-4 border-l-2 border-indigo-200 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>[3] AI Query Understanding (Category, Specs, Intent)</span>
              </div>
              <div className="pl-4 border-l-2 border-indigo-200 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>[4] Search Query Generation (Distributors, B2B, Retailers)</span>
              </div>
              <div className="pl-4 border-l-2 border-indigo-200 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>[5] Web Research Retrieval & Fact Extraction</span>
              </div>
              <div className="pl-4 border-l-2 border-indigo-200 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>[6] Pricing Intelligence (IQR Median, Confidence, Assumptions)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span>[7] Validated Final UI Response with Source Attribution</span>
              </div>
            </div>
          </div>

          {/* 10 Architectural Pillars Summary */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              10 Layer Technical Architecture Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">1</span>
                  Frontend Presentation
                </div>
                <p className="text-slate-700">React 19 + TypeScript + Tailwind v4. Strictly decoupled from provider-specific APIs.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">2</span>
                  Server Coordinator
                </div>
                <p className="text-slate-700">Node/Express proxy layer isolating API secrets, rate limits, and multi-query flow.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">3</span>
                  Database Layer
                </div>
                <p className="text-slate-700">Repository pattern for caching search runs and logging historical price observations.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">4</span>
                  AI Service Abstraction
                </div>
                <p className="text-slate-700">Defined in `src/services/ai/aiService.ts` for clean provider swapping without code churn.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">5</span>
                  Search & Research Layer
                </div>
                <p className="text-slate-700">Defined in `src/services/research/searchService.ts` for multi-source supplier query dispatch.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">6</span>
                  Pricing Engine
                </div>
                <p className="text-slate-700">Defined in `src/services/pricing/pricingService.ts` for statistical bounds and confidence scoring.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">7</span>
                  Data Flow Integrity
                </div>
                <p className="text-slate-700">Single unidirectional flow with explicit `isMockData` and confidence flags.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">8</span>
                  Error Handling
                </div>
                <p className="text-slate-700">Structured client error handling without leaking upstream stack traces or tokens.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">9</span>
                  Security & Zero Leaks
                </div>
                <p className="text-slate-700">Zero frontend secret keys. Server-side proxy execution only in future stages.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">10</span>
                  Clean Folder Boundaries
                </div>
                <p className="text-slate-700">Separate directories for types, validation, services, mocks, components, and layout.</p>
              </div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Product Discipline & MVP Restrictions Check
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Text-Search Only (No image / camera / OCR)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No checkout / cart / marketplace</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No fake live web scraper claims</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mock fixtures strictly isolated in `src/mocks/`</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-700 font-mono">
            /ARCHITECTURE.md reference ready
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Overview
          </Button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Check, Loader2, AlertCircle, Sparkles, Search, Layers, Calculator, Minus } from 'lucide-react';
import { SignatureStageId, StageState } from '@/src/types/pipeline';

export interface PriceraPipelineProps {
  currentStage?: SignatureStageId;
  stageMessage?: string;
  isError?: boolean;
  stageStates?: Partial<Record<SignatureStageId, StageState>>;
  title?: string;
}

const STAGES: { id: SignatureStageId; label: string; icon: React.ElementType; subtext: string }[] = [
  { id: 'understand', label: 'Understand', icon: Sparkles, subtext: 'Spec extraction & intent' },
  { id: 'research', label: 'Research', icon: Search, subtext: 'Supplier catalog lookups' },
  { id: 'compare', label: 'Compare', icon: Layers, subtext: 'Listing & variant match' },
  { id: 'estimate', label: 'Estimate', icon: Calculator, subtext: 'Median pricing model' },
];

export const PriceraPipeline: React.FC<PriceraPipelineProps> = ({
  currentStage = 'understand',
  stageMessage,
  isError = false,
  stageStates,
  title = 'PRICERA Market Pipeline',
}) => {
  const stageOrder: SignatureStageId[] = ['understand', 'research', 'compare', 'estimate'];
  const currentIndex = stageOrder.indexOf(currentStage);

  const getStageState = (stageId: SignatureStageId): StageState => {
    if (stageStates && stageStates[stageId]) {
      return stageStates[stageId]!;
    }
    const idx = stageOrder.indexOf(stageId);
    if (isError && idx === currentIndex) return 'failed';
    if (idx < currentIndex) return 'complete';
    if (idx === currentIndex) return 'processing';
    return 'idle';
  };

  const isResearchUnavailable = stageStates?.research === 'unavailable';
  const displayMessage = stageMessage || (isResearchUnavailable ? 'Live market research is currently unavailable.' : 'Physical market analysis pipeline in execution.');

  return (
    <div
      role="region"
      aria-label="PRICERA Research Pipeline Progression"
      className="w-full max-w-3xl mx-auto my-6 sm:my-8 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg animate-in fade-in duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            {!stageStates && <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />}
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{displayMessage}</p>
        </div>

        <div className="flex items-center gap-2">
          {isResearchUnavailable ? (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 shrink-0">
              Research Layer: Unavailable
            </span>
          ) : !stageStates ? (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700 shrink-0">
              Stage {currentIndex + 1} of 4: {STAGES[currentIndex]?.label || 'Active'}
            </span>
          ) : (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
              Verified Pipeline
            </span>
          )}
        </div>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 relative">
        {STAGES.map((step, idx) => {
          const state = getStageState(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between text-left relative ${
                state === 'complete'
                  ? 'bg-teal-950/40 border-teal-800/90 text-teal-100'
                  : state === 'processing'
                  ? 'bg-slate-800/95 border-teal-400 text-white ring-2 ring-teal-500/30 shadow-md'
                  : state === 'failed'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : state === 'unavailable'
                  ? 'bg-slate-900/90 border-slate-700/80 text-slate-400'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  0{idx + 1}
                </span>

                {/* State Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform duration-200 shrink-0 ${
                    state === 'complete'
                      ? 'bg-teal-600 text-white'
                      : state === 'processing'
                      ? 'bg-teal-400 text-slate-950 shadow-xs'
                      : state === 'failed'
                      ? 'bg-rose-600 text-white'
                      : state === 'unavailable'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {state === 'complete' ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : state === 'processing' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  ) : state === 'failed' ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : state === 'unavailable' ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold tracking-tight block text-white">
                  {step.label}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5 line-clamp-1">
                  {step.subtext}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Status</span>
                <span
                  className={
                    state === 'complete'
                      ? 'text-teal-300 font-semibold'
                      : state === 'processing'
                      ? 'text-teal-400 font-semibold animate-pulse'
                      : state === 'unavailable'
                      ? 'text-amber-400'
                      : state === 'failed'
                      ? 'text-rose-400'
                      : 'text-slate-500'
                  }
                >
                  {state === 'complete'
                    ? 'Verified ✓'
                    : state === 'unavailable'
                    ? 'Unavailable —'
                    : state === 'processing'
                    ? 'Running…'
                    : state === 'failed'
                    ? 'Failed'
                    : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

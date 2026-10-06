import React from 'react';
import { Check, Loader2, AlertCircle, Clock, Sparkles, Search, Layers, Calculator } from 'lucide-react';
import { SignatureStageId, StageState } from '@/src/types/pipeline';

export interface PriceraPipelineProps {
  currentStage: SignatureStageId;
  stageMessage: string;
  isError?: boolean;
}

const STAGES: { id: SignatureStageId; label: string; icon: React.ElementType }[] = [
  { id: 'understand', label: 'Understand', icon: Sparkles },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'compare', label: 'Compare', icon: Layers },
  { id: 'estimate', label: 'Estimate', icon: Calculator },
];

export const PriceraPipeline: React.FC<PriceraPipelineProps> = ({
  currentStage,
  stageMessage,
  isError = false,
}) => {
  const stageOrder: SignatureStageId[] = ['understand', 'research', 'compare', 'estimate'];
  const currentIndex = stageOrder.indexOf(currentStage);

  const getStageState = (stageId: SignatureStageId): StageState => {
    const idx = stageOrder.indexOf(stageId);
    if (isError && idx === currentIndex) return 'failed';
    if (idx < currentIndex) return 'complete';
    if (idx === currentIndex) return 'processing';
    return 'waiting';
  };

  return (
    <div
      role="region"
      aria-label="PRICERA Research Pipeline Progression"
      className="w-full max-w-3xl mx-auto my-8 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg animate-in fade-in duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>PRICERA Market Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{stageMessage}</p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700 shrink-0">
          Stage {currentIndex + 1} of 4: {STAGES[currentIndex]?.label || 'Active'}
        </span>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {STAGES.map((step) => {
          const state = getStageState(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center text-center ${
                state === 'complete'
                  ? 'bg-teal-950/40 border-teal-800/80 text-teal-200'
                  : state === 'processing'
                  ? 'bg-slate-800 border-teal-500 text-white ring-2 ring-teal-500/30'
                  : state === 'failed'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 ${
                  state === 'complete'
                    ? 'bg-teal-600 text-white'
                    : state === 'processing'
                    ? 'bg-teal-500 text-slate-900 shadow-md scale-105'
                    : state === 'failed'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {state === 'complete' ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : state === 'processing' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : state === 'failed' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <span className="text-xs font-bold tracking-tight">{step.label}</span>
              <span className="text-[10px] font-mono capitalize mt-0.5 opacity-80">
                {state === 'complete' ? 'Complete ✓' : state}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

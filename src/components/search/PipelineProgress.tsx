import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Server, Sliders, ShieldCheck, Check } from 'lucide-react';
import { PipelineStage } from '@/src/types/pipeline';

export interface PipelineProgressProps {
  currentStage: PipelineStage;
  stageMessage: string;
}

const STAGES_CONFIG = [
  { id: 'validating', label: 'Client Validation', icon: ShieldCheck },
  { id: 'server', label: 'Server Endpoint', icon: Server },
  { id: 'understanding', label: 'AI Understanding', icon: Sparkles },
  { id: 'schema', label: 'Schema Validation', icon: Sliders },
  { id: 'completed', label: 'Structured Result', icon: Check },
];

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  currentStage,
  stageMessage,
}) => {
  // Map internal stage to step index (0 to 4)
  const getStepIndex = (stg: PipelineStage) => {
    switch (stg) {
      case 'validating':
        return 0;
      case 'understanding':
        return 2;
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const activeIndex = getStepIndex(currentStage);

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Query-Understanding Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{stageMessage}</p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
          Live Server Execution
        </span>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-5 gap-2 pt-2">
        {STAGES_CONFIG.map((step, idx) => {
          const isDone = activeIndex > idx || currentStage === 'completed';
          const isCurrent = activeIndex === idx && currentStage !== 'completed';
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 mb-1.5 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[11px] leading-tight font-medium ${
                  isCurrent
                    ? 'text-indigo-900 font-semibold'
                    : isDone
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Prompt 3 & 4: Server-Side Query Understanding Active</span>
        <span className="font-mono">POST /api/search</span>
      </div>
    </div>
  );
};

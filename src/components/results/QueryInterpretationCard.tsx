import React, { useState } from 'react';
import { Sparkles, Search, ChevronDown, ChevronUp, Tag, HelpCircle } from 'lucide-react';
import { StructuredProductInterpretation } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export interface QueryInterpretationCardProps {
  interpretation: StructuredProductInterpretation;
}

export const QueryInterpretationCard: React.FC<QueryInterpretationCardProps> = ({ interpretation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-slate-200/90 shadow-xs overflow-hidden" padding="none">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-slate-50/60 hover:bg-slate-100/60 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Query Understanding & Search Strategy
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Parsed: <span className="font-semibold text-slate-800">"{interpretation.normalizedQuery}"</span> • {interpretation.identifiedCategory}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-teal-700 font-semibold hidden sm:inline">
            {isExpanded ? 'Hide Pipeline Details' : 'View Pipeline Strategy'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/80 space-y-5 bg-white text-xs text-slate-700">
          {/* Detected specs from query */}
          <div>
            <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Detected Query Parameters
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(interpretation.detectedSpecifications).map(([key, val]) => (
                <div key={key} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">{key}:</span>
                  <span className="font-medium text-slate-900 font-mono">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ambiguities if any */}
          {interpretation.possibleAmbiguities && interpretation.possibleAmbiguities.length > 0 && (
            <div>
              <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-amber-900">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Identified Specification Ambiguities</span>
              </h5>
              <ul className="space-y-1 pl-4 list-disc text-slate-600">
                {interpretation.possibleAmbiguities.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Generated search queries dispatched */}
          <div>
            <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Generated Targeted Search Queries (Dispatched to Suppliers)
            </h5>
            <div className="space-y-1.5 font-mono text-[11px]">
              {interpretation.suggestedSearchQueries.map((q: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-slate-100/70 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800">"{q.query}"</span>
                  </div>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-sans">
                    {q.intent.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

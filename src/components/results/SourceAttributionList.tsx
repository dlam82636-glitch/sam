import React from 'react';
import { ExternalLink, ShieldCheck, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { SourceObservation } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { formatCurrency } from '@/src/lib/utils';

export interface SourceAttributionListProps {
  sources: SourceObservation[];
  isMockData?: boolean;
}

export const SourceAttributionList: React.FC<SourceAttributionListProps> = ({
  sources,
  isMockData = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Source Attribution & Price Observations</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent supplier citations used to establish the market estimate benchmark
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isMockData && (
            <Badge variant="warning" size="sm" className="font-mono text-[10px]">
              Prototype Schema Sources
            </Badge>
          )}
          <Badge variant="neutral" size="sm" className="font-mono">
            {sources.length} Cited Quotes
          </Badge>
        </div>
      </div>

      {isMockData && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
          <strong>Transparency Notice:</strong> The citations listed below are synthetic schema fixtures demonstrating source attribution cards. In Stage 3, these will be populated by live web research queries targeting verified trade merchants and distributors.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3.5">
        {sources.map((src) => (
          <Card
            key={src.id}
            padding="md"
            className="border-slate-200 hover:border-slate-300 transition-all bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-slate-900 text-sm">
                    {src.sourceName}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ({src.sourceDomain})
                  </span>
                  <span className="text-[11px] capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {src.sourceType.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-600">
                  {src.pageTitle}
                </h4>
              </div>

              {/* Observed Price */}
              <div className="shrink-0 sm:text-right">
                <div className="text-lg font-bold font-mono text-slate-900">
                  {formatCurrency(src.observedPrice, src.currency)}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {src.unitOfMeasure}
                </span>
              </div>
            </div>

            {/* Extracted snippet quote */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 font-sans leading-relaxed mb-3 italic">
              "{src.extractedSnippet}"
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Observed: {src.observationDate}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  Spec Match: {Math.round(src.specMatchScore * 100)}%
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                <span>Reference link</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

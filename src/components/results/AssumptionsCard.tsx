import React from 'react';
import { AlertCircle, HelpCircle, Info } from 'lucide-react';
import { PricingAssumption } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export interface AssumptionsCardProps {
  assumptions: PricingAssumption[];
}

export const AssumptionsCard: React.FC<AssumptionsCardProps> = ({ assumptions }) => {
  return (
    <Card className="border-slate-200/90 shadow-xs" padding="lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Pricing Assumptions & Market Uncertainty
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Market estimates rely on specific operational assumptions. Deviations from these parameters (such as order volumes, geographical freight, or grade certifications) will directly impact actual quotes.
      </p>

      <div className="space-y-3">
        {assumptions.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 leading-snug">
                {item.statement}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {item.context}
              </p>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase ${
                  item.impactLevel === 'high'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : item.impactLevel === 'medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {item.impactLevel} impact
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

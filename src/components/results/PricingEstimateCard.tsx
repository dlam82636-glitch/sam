import React from 'react';
import { TrendingUp, ShieldCheck, HelpCircle, Layers, BarChart3, AlertCircle } from 'lucide-react';
import { PriceEstimate, ConfidenceRating } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { formatCurrency } from '@/src/lib/utils';

export interface PricingEstimateCardProps {
  estimate: PriceEstimate;
}

export const PricingEstimateCard: React.FC<PricingEstimateCardProps> = ({ estimate }) => {
  const { range, confidenceRating, sampleSize, dataFreshness, marketConditionNotes, priceSpreadPercent } = estimate;

  const getConfidenceBadge = (rating: ConfidenceRating) => {
    switch (rating) {
      case 'HIGH':
        return <Badge variant="success">High Confidence ({sampleSize} sources)</Badge>;
      case 'MODERATE':
        return <Badge variant="info">Moderate Confidence ({sampleSize} sources)</Badge>;
      case 'LOW':
        return <Badge variant="warning">Low Confidence ({sampleSize} sources)</Badge>;
      case 'PRELIMINARY':
      default:
        return <Badge variant="neutral">Preliminary Prototype ({sampleSize} sources)</Badge>;
    }
  };

  // Calculate percentage placement for median on the min-max bar
  const spread = Math.max(0.01, range.max - range.min);
  const medianPercentage = Math.min(95, Math.max(5, ((range.median - range.min) / spread) * 100));

  return (
    <Card className="border-slate-200/90 shadow-xs overflow-hidden" padding="none">
      {/* Top Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Market Price Estimate
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-indigo-300 font-mono">{range.unit}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
              {formatCurrency(range.median, range.currency)}
            </span>
            <span className="text-xs text-slate-300">
              estimated benchmark median
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          {getConfidenceBadge(confidenceRating)}
          <span className="text-[11px] text-slate-400 font-mono">
            {dataFreshness}
          </span>
        </div>
      </div>

      {/* Price Range Visual Meter */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
          <span>Lower Bound (Volume / Low Tier)</span>
          <span>Upper Bound (Retail / High Tier)</span>
        </div>

        {/* Visual Bar */}
        <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden my-3">
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-emerald-400 via-indigo-500 to-amber-500 opacity-80 rounded-full" />
        </div>

        {/* Bound Figures */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 font-mono">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-normal">Min Observed</span>
            <span>{formatCurrency(range.min, range.currency)}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] text-indigo-600 font-normal">Median</span>
            <span className="text-indigo-900 font-bold">{formatCurrency(range.median, range.currency)}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] text-slate-400 font-normal">Max Observed</span>
            <span>{formatCurrency(range.max, range.currency)}</span>
          </div>
        </div>

        {/* Spread statistic */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Market Spread: <strong>{priceSpreadPercent}% variance</strong> across source observations</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">Currency: {range.currency}</span>
        </div>
      </div>

      {/* Market Condition Context */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span>Market Dynamics & Observations</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {marketConditionNotes}
          </p>
        </div>

        {/* Strict Verification Safeguard Notice */}
        <div className="p-3.5 rounded-lg bg-slate-100/80 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Strict Attribution Safeguard:</strong> MarketSpec aggregates quotes exclusively from real supplier observations and never presents synthetic AI outputs as verified exact prices.
          </p>
        </div>
      </div>
    </Card>
  );
};

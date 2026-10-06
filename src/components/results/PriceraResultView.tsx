import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Calendar,
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileText,
  Search,
} from 'lucide-react';
import { PriceraResearchResponse } from '@/src/types/pipeline';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { formatCurrency } from '@/src/lib/utils';

export interface PriceraResultViewProps {
  response: PriceraResearchResponse;
  onReset: () => void;
  onOpenArchitectureModal?: () => void;
}

export const PriceraResultView: React.FC<PriceraResultViewProps> = ({
  response,
  onReset,
  onOpenArchitectureModal,
}) => {
  const { understanding, research, pricing, query, cached } = response;

  const hasEstimatedPrice = pricing.estimatedPrice !== null && pricing.estimatedPrice > 0;

  const getConfidenceBadge = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'high':
        return (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            High Confidence ({pricing.sampleSize} sources)
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="info" size="md">
            <Info className="w-3.5 h-3.5 mr-1" />
            Medium Confidence ({pricing.sampleSize} sources)
          </Badge>
        );
      case 'low':
      default:
        return (
          <Badge variant="warning" size="md">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Limited / Low Confidence ({pricing.sampleSize} sources)
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">PRICERA Market Report</span>
            {cached && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-teal-800 border border-slate-200">
                cached snapshot
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono">
              • Analyzed in {response.executionTimeMs}ms
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            "{query}"
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            New Search
          </Button>
        </div>
      </div>

      {/* 2. Research Provider Status Notice (Transparent, Non-Fabricated) */}
      {research.status === 'provider_unconfigured' && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold uppercase tracking-wider text-amber-900">
                Research Provider Environment Notice
              </div>
              <p className="text-amber-800/95 leading-relaxed">
                {research.message || 'Live web search requires a configured SEARCH_API_KEY. In accordance with PRICERA core integrity rules, no simulated prices or fake source listings have been fabricated.'}
              </p>
              {onOpenArchitectureModal && (
                <button
                  onClick={onOpenArchitectureModal}
                  className="font-semibold text-teal-800 hover:text-teal-950 underline mt-1 block"
                >
                  Review PRICERA System Architecture
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Product & Price Grid (Hierarchy: PRODUCT + EVIDENCE + PRICE + CONFIDENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Identified Product & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200/90 shadow-xs" padding="lg">
            {/* Category Breadcrumbs */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="neutral" size="sm" className="font-mono">
                {understanding.category}
              </Badge>
              {understanding.brand && (
                <>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-xs text-slate-600 font-medium">
                    Brand: <strong className="text-slate-900">{understanding.brand}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Canonical Name */}
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {understanding.name}
            </h3>

            {/* Factual Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {understanding.description}
            </p>

            {/* Specifications Grid */}
            <div className="pt-5 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Sliders className="w-3.5 h-3.5 text-teal-600" />
                <span>Extracted Product Specifications</span>
              </h4>

              {understanding.specifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {understanding.specifications.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80 font-mono hover:bg-teal-50 hover:border-teal-200 transition-colors"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No explicit dimensions or technical parameters detected in query.
                </p>
              )}
            </div>

            {/* Variants */}
            {understanding.possible_variants && understanding.possible_variants.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Recognized Variant Categories
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {understanding.possible_variants.map((v, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Research Queries Used for Retrieval */}
          <Card className="border-slate-200/90 shadow-xs" padding="md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Targeted Research Queries Dispatched
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {understanding.search_queries.length} queries
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {understanding.search_queries.map((sq, i) => (
                <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200/60 text-slate-800">
                  {sq}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): PRICERA Price Card & Statistical Bounds */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Price Card */}
          <Card className="border-slate-800 bg-slate-900 text-white overflow-hidden shadow-md" padding="none">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-bold font-mono">
                  Estimated Market Price
                </span>
                {getConfidenceBadge(pricing.confidence)}
              </div>

              {hasEstimatedPrice ? (
                <div>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                      {formatCurrency(pricing.estimatedPrice!, pricing.currency || 'USD')}
                    </span>
                    <span className="text-xs text-slate-400">
                      median benchmark
                    </span>
                  </div>

                  {pricing.minPrice !== null && pricing.maxPrice !== null && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-sans">Low Observed</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(pricing.minPrice, pricing.currency || 'USD')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans">High Observed</span>
                        <span className="font-semibold text-amber-400">{formatCurrency(pricing.maxPrice, pricing.currency || 'USD')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    No reliable market price found
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No verified price observations could be extracted from available search listings for this specific specification.
                  </p>
                </div>
              )}

              {/* Methodology statement */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-teal-300 block mb-1">Methodology:</span>
                <p className="text-slate-400 italic">"{pricing.methodology}"</p>
              </div>
            </div>

            {/* Attribution footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Evidence-driven calculation</span>
              </span>
              <span className="font-mono">PRICERA Engine</span>
            </div>
          </Card>

          {/* Documented Limitations Card */}
          {pricing.limitations.length > 0 && (
            <Card className="border-slate-200/90 shadow-xs" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Market Limitations & Exclusions
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {pricing.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* 4. Verified Price Observations & Sources List */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Traceable Price Observations ({pricing.priceObservations.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual online listings contributing to the market intelligence estimate
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {pricing.priceObservations.length} verified data points
          </span>
        </div>

        {pricing.priceObservations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {pricing.priceObservations.map((obs, idx) => (
              <Card
                key={idx}
                padding="md"
                className={`border-slate-200 hover:border-teal-500 transition-all ${
                  obs.isOutlier ? 'bg-amber-50/40 border-amber-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-mono text-teal-700 font-semibold uppercase block">
                      {obs.source}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {obs.title}
                    </h5>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-bold font-mono text-slate-900">
                      {formatCurrency(obs.price, obs.currency)}
                    </div>
                    {obs.isOutlier && (
                      <span className="text-[10px] font-mono text-amber-700 uppercase bg-amber-100 px-1 rounded">
                        Outlier Excluded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{obs.retrievedAt.split('T')[0]}</span>
                  </span>

                  <a
                    href={obs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No external price observations recorded for this query.
          </div>
        )}
      </div>
    </div>
  );
};

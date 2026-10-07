import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Info,
  Calendar,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { PriceraResearchResponse, StageState } from '@/src/types/pipeline';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { formatCurrency } from '@/src/lib/utils';
import { PriceraPipeline } from '@/src/components/search/PriceraPipeline';

export interface PriceraResultViewProps {
  response: PriceraResearchResponse;
  onReset: () => void;
  onSearchAnother?: (query: string) => void;
  onOpenArchitectureModal?: () => void;
}

export const PriceraResultView: React.FC<PriceraResultViewProps> = ({
  response,
  onReset,
  onSearchAnother,
  onOpenArchitectureModal,
}) => {
  // Gracefully extract fields supporting both Part 2 schema and legacy fields
  const product = response.product || {
    name: response.understanding?.name || 'Unspecified Product',
    category: response.understanding?.category || 'General Goods',
    description: response.understanding?.description || '',
    brand: response.understanding?.brand || null,
    model: response.understanding?.model || null,
    material: response.understanding?.material || null,
    specifications: response.understanding?.specifications || [],
    possibleVariants: response.understanding?.possible_variants || [],
    confidence: response.understanding?.confidence || 0.8,
    uncertainties: response.understanding?.uncertainties || [],
  };

  const research = response.research || {
    status: 'idle',
    sources: [],
    sourceCount: 0,
    executedQueries: [],
  };

  const pricing = response.pricing || {
    currency: null,
    minPrice: null,
    maxPrice: null,
    estimatedPrice: null,
    confidence: 'low',
    priceObservations: [],
    methodology: 'No pricing data available.',
    limitations: [],
    sampleSize: 0,
  };

  const searchMeta = response.search || {
    query: response.query || product.name,
    timestamp: new Date().toISOString(),
    status: (research.status === 'provider_unconfigured' || pricing.estimatedPrice === null) ? 'partial' : 'complete',
    executionTimeMs: response.executionTimeMs,
    cached: response.cached,
  };

  const pipeline = response.pipeline || {
    understanding: 'complete',
    research: research.status === 'provider_unconfigured' ? 'unavailable' : (research.status === 'success' ? 'complete' : 'failed'),
    pricing: pricing.estimatedPrice !== null ? 'complete' : (research.status === 'provider_unconfigured' ? 'unavailable' : 'partial'),
  };

  const isResearchUnavailable = research.status === 'provider_unconfigured';
  const hasEstimatedPrice = pricing.estimatedPrice !== null && pricing.estimatedPrice > 0;
  const isPartialResult = isResearchUnavailable || !hasEstimatedPrice;

  // Derive pipeline stage states for the visual pipeline bar
  const stageStates: Record<string, StageState> = {
    understand: 'complete',
    research: isResearchUnavailable
      ? 'unavailable'
      : research.status === 'success' || research.status === 'no_results'
      ? 'complete'
      : 'failed',
    compare: isResearchUnavailable ? 'unavailable' : 'complete',
    estimate: hasEstimatedPrice
      ? 'complete'
      : isResearchUnavailable
      ? 'unavailable'
      : 'complete',
  };

  // Human-readable confidence explanations (Part 10)
  const getConfidenceExplanation = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'high':
        return 'Based on multiple verified comparable listings with strong price agreement across sources.';
      case 'medium':
        return `Based on ${pricing.sampleSize || pricing.priceObservations.length} comparable listings with noticeable variation in observed distributor prices.`;
      case 'low':
      default:
        return 'Limited or single-source evidence. Exercise caution as supplier quotes and local availability may vary widely.';
    }
  };

  const getProductConfidenceLabel = (conf: number) => {
    if (conf >= 0.85) return { label: 'High', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (conf >= 0.6) return { label: 'Moderate', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    return { label: 'Low (Ambiguous Query)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  // Parse specifications into Key / Value pairs for Part 8
  const parsedSpecs = product.specifications.map((spec, index) => {
    const colonIndex = spec.indexOf(':');
    if (colonIndex > 0) {
      return {
        id: `spec-${index}`,
        label: spec.slice(0, colonIndex).trim(),
        value: spec.slice(colonIndex + 1).trim(),
      };
    }
    return {
      id: `spec-${index}`,
      label: `Specification ${index + 1}`,
      value: spec.trim(),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Bar with Query & Search Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-teal-800 font-bold font-mono">
              PRICERA Market Intelligence
            </span>
            {searchMeta.cached && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-teal-800 border border-slate-200">
                cached snapshot
              </span>
            )}
            {searchMeta.executionTimeMs && (
              <span className="text-xs text-slate-400 font-mono">
                • {searchMeta.executionTimeMs}ms
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            "{searchMeta.query}"
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Search Another Product
          </Button>
        </div>
      </div>

      {/* 2. Visual Pipeline Progress Reflection (Part 3) */}
      <PriceraPipeline
        stageStates={stageStates}
        title="PRICERA Research Pipeline Execution"
        stageMessage={
          isResearchUnavailable
            ? 'Live market research is currently unavailable.'
            : hasEstimatedPrice
            ? 'All 4 pipeline stages completed successfully.'
            : 'Product understood, but insufficient pricing data was found.'
        }
      />

      {/* 3. Partial Result / Provider Notice (Parts 15 & 16) */}
      {isPartialResult && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 shadow-2xs"
        >
          <div className="flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-amber-900 text-sm">
                {isResearchUnavailable
                  ? 'Live Market Research Unavailable'
                  : 'Product Researched Successfully — No Estimate Available'}
              </div>
              <p className="text-amber-800/95 leading-relaxed text-xs sm:text-sm">
                {isResearchUnavailable
                  ? 'External search provider API key (SEARCH_API_KEY) is not configured in the server environment. In accordance with PRICERA core integrity rules, no synthetic source listings or simulated prices have been fabricated.'
                  : 'PRICERA found relevant research sources, but there was not enough reliable comparable pricing data to produce a market estimate.'}
              </p>
              {onOpenArchitectureModal && (
                <button
                  type="button"
                  onClick={onOpenArchitectureModal}
                  className="font-semibold text-teal-800 hover:text-teal-950 underline mt-1 inline-block cursor-pointer"
                >
                  Review PRICERA System Architecture
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Core Results Hierarchy: PRODUCT (1) + PRICE ESTIMATE (2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): PRODUCT IDENTIFICATION CARD (Part 7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200/90 shadow-xs" padding="lg">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 font-bold">
                1. Product Identification
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                  getProductConfidenceLabel(product.confidence).color
                }`}
              >
                Identification: {getProductConfidenceLabel(product.confidence).label}
              </span>
            </div>

            {/* Canonical Product Name */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {product.name}
            </h3>

            {/* Category Breadcrumb */}
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium mb-4">
              Category: {product.category}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Key Identification Parameters (Brand, Model, Material) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-mono text-[10px]">Brand</span>
                <span className="font-semibold text-slate-900">
                  {product.brand || <span className="text-slate-400 italic font-normal">Not specified</span>}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-mono text-[10px]">Model</span>
                <span className="font-semibold text-slate-900">
                  {product.model || <span className="text-slate-400 italic font-normal">Not specified</span>}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-mono text-[10px]">Material</span>
                <span className="font-semibold text-slate-900">
                  {product.material || <span className="text-slate-400 italic font-normal">Not specified</span>}
                </span>
              </div>
            </div>

            {/* Relevant Uncertainties & Ambiguities */}
            {product.uncertainties && product.uncertainties.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ambiguities & Information Gaps</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {product.uncertainties.map((unc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{unc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {product.possibleVariants && product.possibleVariants.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Known Related Variants
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.possibleVariants.map((v, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Prospective Search Queries used for research */}
          {research.executedQueries && research.executedQueries.length > 0 && (
            <Card className="border-slate-200/90 shadow-xs" padding="md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Targeted Supplier Queries
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {research.executedQueries.length} dispatched
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {research.executedQueries.map((sq, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200/60 text-slate-800">
                    {sq}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (5 cols): PRICE ESTIMATE CARD (Parts 9 & 10) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-800 bg-slate-900 text-white overflow-hidden shadow-lg" padding="none">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-bold font-mono">
                  2. Estimated Market Price
                </span>
                {hasEstimatedPrice && (
                  <Badge
                    variant={pricing.confidence === 'high' ? 'success' : pricing.confidence === 'medium' ? 'info' : 'warning'}
                    size="md"
                  >
                    {pricing.confidence.toUpperCase()} CONFIDENCE
                  </Badge>
                )}
              </div>

              {hasEstimatedPrice ? (
                <div>
                  <div className="my-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white block">
                      {formatCurrency(pricing.estimatedPrice!, pricing.currency || 'USD')}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Median benchmark from compatible commercial observations
                    </span>
                  </div>

                  {/* Range and Bounds */}
                  {pricing.minPrice !== null && pricing.maxPrice !== null && (
                    <div className="mt-5 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Observed Price Range</span>
                        <span className="font-mono text-slate-300">
                          {pricing.sampleSize || pricing.priceObservations.length} comparable sources
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between font-mono text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] uppercase font-sans text-slate-400 block">Low</span>
                          <span className="font-bold text-emerald-400">
                            {formatCurrency(pricing.minPrice, pricing.currency || 'USD')}
                          </span>
                        </div>
                        <div className="text-slate-500 font-bold">—</div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-sans text-slate-400 block">High</span>
                          <span className="font-bold text-amber-400">
                            {formatCurrency(pricing.maxPrice, pricing.currency || 'USD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confidence Explanation (Part 10) */}
                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs leading-relaxed">
                    <span className="text-teal-300 font-bold block mb-1">
                      {pricing.confidence === 'high' ? 'High Confidence' : pricing.confidence === 'medium' ? 'Medium Confidence' : 'Low Confidence'}:
                    </span>
                    <p className="text-slate-300">
                      {getConfidenceExplanation(pricing.confidence)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="my-4 p-4 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <div className="text-sm font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No reliable market price found</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isResearchUnavailable
                      ? 'PRICERA found relevant research sources, but live web search is unconfigured in this environment. In accordance with PRICERA core integrity rules, no synthetic prices were fabricated.'
                      : 'PRICERA found relevant research sources, but there was not enough reliable comparable pricing data to produce an estimate.'}
                  </p>
                </div>
              )}

              {/* Methodology Explanation (Part 13) */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-teal-300 block mb-1">
                  How this estimate was calculated:
                </span>
                <p className="text-slate-400 italic">"{pricing.methodology}"</p>
              </div>
            </div>

            {/* Trust disclaimer footer (Part 12) */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Evidence-driven calculation</span>
              </span>
              <span className="font-mono text-slate-500">PRICERA Engine</span>
            </div>
          </Card>

          {/* Limitations & Uncertainty Card (Part 14) */}
          {pricing.limitations && pricing.limitations.length > 0 && (
            <Card className="border-slate-200/90 shadow-xs" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Important Limitations & Assumptions
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

      {/* 5. SPECIFICATIONS TABLE (Part 8) */}
      <Card className="border-slate-200/90 shadow-xs" padding="none">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>3. Product Specifications</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted dimensions, grades, and standards identified from query analysis
            </p>
          </div>
          <Badge variant="neutral" size="sm" className="font-mono">
            {parsedSpecs.length} Parameters
          </Badge>
        </div>

        {parsedSpecs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
                  <th className="py-3 px-5 sm:px-6">Specification Parameter</th>
                  <th className="py-3 px-5 sm:px-6">Extracted Value / Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedSpecs.map((spec) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-teal-50/40 hover:text-teal-950 transition-colors group cursor-default"
                  >
                    <td className="py-3.5 px-5 sm:px-6 font-medium text-slate-800 group-hover:text-teal-900">
                      {spec.label}
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 font-mono font-medium text-slate-900 group-hover:text-teal-950">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 italic">
            No specific technical dimensions or grades were specified in this query.
          </div>
        )}
      </Card>

      {/* 6. SOURCE PRICES & ATTRIBUTION (Parts 11 & 12) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>4. Source Prices</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prices shown are observations retrieved from available sources and may change.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {pricing.priceObservations.length} price observations ({research.sourceCount || research.sources.length} sources)
          </span>
        </div>

        {/* Display real source listings */}
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
                    <span>Retrieved: {obs.retrievedAt?.split('T')[0] || 'Recent'}</span>
                  </span>

                  {obs.url && obs.url.startsWith('http') ? (
                    <a
                      href={obs.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium group"
                    >
                      <span>View source</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Distributor Catalog</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="text-sm font-semibold text-slate-700">
              No live price observations recorded
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {isResearchUnavailable
                ? 'Live web research is currently unconfigured. In accordance with PRICERA core integrity rules, no simulated prices or fictitious supplier listings are displayed.'
                : 'No commercial listings with verified price values were found for this query in available catalogs.'}
            </p>
          </div>
        )}
      </div>

      {/* 7. Bottom Search Another Product Action (Part 19) */}
      <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/70 p-6 rounded-2xl">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Need to analyze another material or item?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset the pipeline and explore market benchmarks for any physical product.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="shadow-xs w-full sm:w-auto"
        >
          Search Another Product
        </Button>
      </div>
    </div>
  );
};

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
  Globe,
  Building2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { PriceraResearchResponse, StageState } from '@/src/types/pipeline';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { formatCurrency } from '@/src/lib/utils';
import { PriceraPipeline } from '@/src/components/search/PriceraPipeline';
import { BuyOpportunitiesSection } from './BuyOpportunitiesSection';

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

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'methodology' | 'factors' | 'limitations'>('methodology');
  const [activeSourceTab, setActiveSourceTab] = useState<'prices' | 'all' | 'excluded'>('prices');

  const getClassificationBadge = (classification?: string) => {
    switch (classification) {
      case 'MARKETPLACE':
        return {
          label: 'Marketplace',
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'RETAILER':
        return {
          label: 'Retailer',
          className: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'DISTRIBUTOR':
        return {
          label: 'Distributor',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'SPECIFICATION_SOURCE':
        return {
          label: 'Specification Source',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'MANUFACTURER_SOURCE':
        return {
          label: 'Manufacturer',
          className: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'PRICE_SOURCE':
        return {
          label: 'Price Source',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'GENERAL_REFERENCE':
      default:
        return {
          label: 'General Reference',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
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
          <Card className="border-slate-200/90 shadow-card" padding="lg">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 font-bold">
                01 — Product Identification
              </span>
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${
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

        {/* Right Column (5 cols): PRICE ESTIMATE CARD & ANALYSIS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-800 bg-[#0B1220] text-white overflow-hidden shadow-xl shadow-slate-950/20" padding="none">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-bold font-mono">
                  {pricing.sampleSize === 1 ? '02 — Reference Price' : '02 — Market Price'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pricing.isForeignMarketEvidence ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🌍 Foreign-Market Evidence
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      🇳🇬 Nigerian Market Benchmark
                    </span>
                  )}
                  {hasEstimatedPrice && (
                    pricing.sampleSize === 1 ? (
                      <Badge
                        variant="warning"
                        size="md"
                        className="font-mono text-[11px]"
                      >
                        Low confidence · 1 usable price
                      </Badge>
                    ) : (
                      <Badge
                        variant={pricing.confidence === 'high' ? 'success' : pricing.confidence === 'medium' ? 'teal' : 'warning'}
                        size="md"
                        className="font-mono text-[11px]"
                      >
                        {pricing.confidence.toUpperCase()} CONFIDENCE
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {hasEstimatedPrice ? (
                <div>
                  <div className="my-4">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-white block">
                      {formatCurrency(pricing.estimatedPrice!, pricing.currency || 'USD')}
                    </span>
                    <span className="text-xs text-slate-400 mt-1.5 block">
                      {pricing.sampleSize === 1
                        ? 'Reference price · Single commercial observation'
                        : 'Statistical median benchmark from comparable commercial listings'}
                    </span>
                  </div>

                  {/* Range and Bounds or Single-Price Callout */}
                  {pricing.sampleSize === 1 ? (
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Reference Price Notice</span>
                          </span>
                          <span className="font-mono text-amber-200/80 text-[11px]">
                            1 usable price · {pricing.counts?.totalResearchSources ?? research.sourceCount ?? research.sources.length} research sources
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Only one usable commercial price was found, so PRICERA cannot establish a reliable market range or competitive median. Treat this figure as a reference quote rather than an established market price.
                        </p>
                        <div className="pt-2 border-t border-amber-500/20 text-[11px] font-mono text-amber-200/70">
                          A reliable market range requires at least two comparable observations.
                        </div>
                      </div>
                    </div>
                  ) : pricing.minPrice !== null && pricing.maxPrice !== null && (
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Observed Market Range</span>
                        <span className="font-mono text-slate-300">
                          {pricing.sampleSize || pricing.priceObservations.length} usable {pricing.sampleSize === 1 ? 'price' : 'prices'} · {pricing.counts?.totalResearchSources ?? research.sourceCount ?? research.sources.length} research sources
                        </span>
                      </div>

                      {/* Visual Range Meter */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2 relative">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 h-full rounded-full"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] uppercase font-sans text-slate-400 block">Low Observation</span>
                          <span className="font-bold text-emerald-400">
                            {formatCurrency(pricing.minPrice, pricing.currency || 'USD')}
                          </span>
                        </div>
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-sans text-teal-400 block font-semibold">Median</span>
                          <span className="font-bold text-white text-xs">
                            {formatCurrency(pricing.estimatedPrice!, pricing.currency || 'USD')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-sans text-slate-400 block">High Observation</span>
                          <span className="font-bold text-amber-400">
                            {formatCurrency(pricing.maxPrice, pricing.currency || 'USD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confidence Explanation */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      <span className="text-teal-300 font-bold">
                        {pricing.sampleSize === 1
                          ? 'Low Confidence Reference'
                          : pricing.confidence === 'high'
                          ? 'High Confidence Evidence'
                          : pricing.confidence === 'medium'
                          ? 'Medium Confidence Evidence'
                          : 'Low Confidence Evidence'}:
                      </span>
                    </div>
                    <p className="text-slate-300 pl-3.5">
                      {pricing.sampleSize === 1
                        ? 'Single commercial observation available. A market range or median requires at least two comparable observations.'
                        : getConfidenceExplanation(pricing.confidence)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="my-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-sm font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No reliable market price found</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isResearchUnavailable
                      ? 'Live market research is currently unconfigured in this environment. In accordance with PRICERA core integrity rules, no synthetic quotes or simulated prices were fabricated.'
                      : 'PRICERA retrieved relevant supplier listings, but there was insufficient comparable pricing data to produce a reliable statistical benchmark.'}
                  </p>
                </div>
              )}
            </div>

            {/* Evidence & Integrity Footer */}
            <div className="px-6 py-3 bg-[#080D17] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Evidence-driven calculation</span>
              </span>
              <span className="font-mono text-slate-300 font-semibold">
                {pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length} usable {(pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length) === 1 ? 'price' : 'prices'} · {pricing.counts?.totalResearchSources ?? research.sourceCount ?? research.sources.length} research sources
              </span>
            </div>
          </Card>

          {/* Interactive Methodology & Limitations Panel */}
          <Card className="border-slate-200/90 shadow-xs" padding="none">
            {/* Segmented Tab Headers */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1 rounded-t-xl">
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('methodology')}
                className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                  activeAnalysisTab === 'methodology'
                    ? 'bg-white text-teal-950 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Methodology
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('factors')}
                className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                  activeAnalysisTab === 'factors'
                    ? 'bg-white text-teal-950 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Price Factors
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('limitations')}
                className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                  activeAnalysisTab === 'limitations'
                    ? 'bg-white text-teal-950 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Limitations
              </button>
            </div>

            <div className="p-5 text-xs text-slate-600 leading-relaxed">
              {activeAnalysisTab === 'methodology' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Info className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>How this estimate was calculated</span>
                  </div>
                  <p className="text-slate-700 italic">
                    "{pricing.methodology}"
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Algorithm: Interquartile Range Median</span>
                    <span>Status: Verified</span>
                  </div>
                </div>
              )}

              {activeAnalysisTab === 'factors' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Sliders className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>What could affect observed prices</span>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span><strong>Procurement Volume:</strong> Wholesale pack or pallet orders typically reduce unit pricing compared to single-item orders.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span><strong>Regional Logistics:</strong> Freight, oversized handling, and regional import duties affect landed quotes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span><strong>Specification Precision:</strong> Exact brand, thickness, alloy grade, or warranty tiers alter market position.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeAnalysisTab === 'limitations' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Market Limitations & Assumptions</span>
                  </div>
                  {pricing.limitations && pricing.limitations.length > 0 ? (
                    <ul className="space-y-1.5 pl-1">
                      {pricing.limitations.map((lim, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">
                      Estimates reflect recent online merchant listings and do not account for unadvertised negotiated trade rates or spot market commodity swings.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 4.5. VERIFIED COMMERCIAL OFFERS & WHERE TO BUY */}
      <BuyOpportunitiesSection
        buyOpportunities={response.buyOpportunities}
        offers={response.commercialOffers}
        productName={product.name}
        marketCurrency={pricing.currency}
        marketEstimatedPrice={pricing.estimatedPrice}
      />

      {/* 5. SPECIFICATIONS TABLE (Part 8) */}
      <Card className="border-slate-200/90 shadow-card" padding="none">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>03 — Technical Specifications</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted dimensions, grades, and standards identified from query analysis
            </p>
          </div>
          <Badge variant="teal" size="sm" className="font-mono">
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

      {/* 6. SOURCE PRICES & ATTRIBUTION (Prompt 5) */}
      <div className="space-y-5 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <span>04 — Observed Source Prices & Research Citations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distinguishing verified commercial price quotes from technical specification references and manufacturer portals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200/80">
              {pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length} usable {(pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length) === 1 ? 'price' : 'prices'} · {pricing.counts?.totalResearchSources ?? research.sourceCount ?? research.sources.length} research sources
            </span>
          </div>
        </div>

        {/* Dual Metric Separation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white border border-teal-200/70 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase text-teal-800 font-bold tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                <span>Usable Price Observations</span>
              </span>
              <p className="text-xs text-slate-500">
                Verified commercial quotes used for median calculation
              </p>
            </div>
            <div className="text-right pl-3 shrink-0">
              <span className="text-3xl font-extrabold font-mono text-teal-900">
                {pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase text-slate-600 font-bold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Total Research Sources</span>
              </span>
              <p className="text-xs text-slate-500">
                Web portals, retailer catalogs & spec databases analyzed
              </p>
            </div>
            <div className="text-right pl-3 shrink-0">
              <span className="text-3xl font-extrabold font-mono text-slate-800">
                {pricing.counts?.totalResearchSources ?? research.sourceCount ?? research.sources.length}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSourceTab('prices')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSourceTab === 'prices'
                ? 'border-teal-700 text-teal-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Usable Price Observations</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-900 font-mono font-bold">
              {pricing.counts?.usablePriceObservations ?? pricing.priceObservations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSourceTab('all')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSourceTab === 'all'
                ? 'border-teal-700 text-teal-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All Research Sources & Specifications</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
              {pricing.counts?.totalResearchSources ?? research.sources.length}
            </span>
          </button>

          {pricing.excludedObservations && pricing.excludedObservations.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveSourceTab('excluded')}
              className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeSourceTab === 'excluded'
                  ? 'border-teal-700 text-teal-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Excluded / Non-Commercial Listings</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-mono font-bold">
                {pricing.excludedObservations.length}
              </span>
            </button>
          )}
        </div>

        {/* TAB 1: USABLE PRICE OBSERVATIONS */}
        {activeSourceTab === 'prices' && (
          <div>
            {pricing.priceObservations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {pricing.priceObservations.map((obs, idx) => {
                  const badgeInfo = getClassificationBadge(obs.classification || 'PRICE_SOURCE');
                  const isNig = Boolean(
                    obs.isNigerianSource ||
                    obs.currency === 'NGN' ||
                    obs.source?.toLowerCase().includes('.ng') ||
                    obs.title?.toLowerCase().includes('nigeria') ||
                    obs.title?.toLowerCase().includes('lagos')
                  );

                  return (
                    <Card
                      key={idx}
                      padding="md"
                      className={`border-slate-200 hover:border-teal-500 transition-all ${
                        obs.isOutlier ? 'bg-amber-50/40 border-amber-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-mono text-teal-900 font-bold uppercase">
                              {obs.source}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${badgeInfo.className}`}>
                              {badgeInfo.label}
                            </span>
                            {isNig && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                                🇳🇬 Nigeria
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-2">
                            {obs.title}
                          </h5>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-bold font-mono text-slate-900">
                            {formatCurrency(obs.price, obs.currency)}
                          </div>
                          {obs.isOutlier && (
                            <span className="text-[10px] font-mono text-amber-700 uppercase bg-amber-100 px-1 rounded block mt-0.5">
                              Outlier Excluded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-100 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{obs.retrievedAt?.split('T')[0] || 'Recent'}</span>
                        </span>

                        {obs.url && obs.url.startsWith('http') ? (
                          <a
                            href={obs.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-sans font-semibold group"
                          >
                            <span>View source</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        ) : (
                          <span className="text-slate-400">Merchant Catalog</span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="text-sm font-semibold text-slate-700">
                  No live price observations recorded
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {isResearchUnavailable
                    ? 'Live web research is currently unconfigured. In accordance with PRICERA core integrity rules, no simulated prices or fictitious supplier listings are displayed.'
                    : 'Relevant sources were retrieved, but no verified commercial prices were extracted from stores.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL RESEARCH SOURCES & SPECIFICATIONS */}
        {activeSourceTab === 'all' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
              <strong>Transparent Source Attribution:</strong> PRICERA indexes technical specification databases (such as GSMArena or Kimovil), manufacturer documentation, and commercial retailers. Specification portals provide technical attributes but are intentionally separated from commercial price observations.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {research.sources.map((src, idx) => {
                const badgeInfo = getClassificationBadge(src.classification || 'GENERAL_REFERENCE');
                const isNig = Boolean(
                  src.isNigerianSource ||
                  src.currency === 'NGN' ||
                  src.source?.toLowerCase().includes('.ng') ||
                  src.title?.toLowerCase().includes('nigeria') ||
                  src.title?.toLowerCase().includes('lagos')
                );

                const isSpec = src.classification === 'SPECIFICATION_SOURCE';

                return (
                  <Card
                    key={idx}
                    padding="md"
                    className="border-slate-200/90 bg-white hover:border-teal-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span className="text-[11px] font-mono text-slate-900 font-bold uppercase">
                          {src.source}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${badgeInfo.className}`}>
                          {badgeInfo.label}
                        </span>
                        {isNig && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                            🇳🇬 Nigeria
                          </span>
                        )}
                        {isSpec && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-purple-50 text-purple-700 border border-purple-200">
                            Specs Reference
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 mb-1.5 line-clamp-2">
                        {src.title}
                      </h5>

                      {src.rawSnippet && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                          "{src.rawSnippet}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-100 font-mono">
                      <div>
                        {src.price && src.currency && src.isCommercialPriceSource ? (
                          <span className="font-bold text-teal-800">
                            Quote: {formatCurrency(src.price, src.currency)}
                          </span>
                        ) : isSpec ? (
                          <span className="text-purple-700 font-medium font-sans">
                            Spec Data Only
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Catalog Reference
                          </span>
                        )}
                      </div>

                      {src.url && src.url.startsWith('http') && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-sans font-semibold group"
                        >
                          <span>Visit link</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: EXCLUDED / NON-COMMERCIAL LISTINGS */}
        {activeSourceTab === 'excluded' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Evidence Filtering & Integrity Policy:</strong> PRICERA filters out non-commercial sources (specification portals like GSMArena), distinct product variants, incompatible pack sizes, and non-target currencies to protect market median estimates from artificial distortion.
            </div>

            {pricing.excludedObservations && pricing.excludedObservations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {pricing.excludedObservations.map((ex, idx) => {
                  const getReasonBadge = (reason: string) => {
                    switch (reason) {
                      case 'non_commercial_source':
                        return { label: 'Spec / Reference Source', className: 'bg-purple-100 text-purple-800 border-purple-200' };
                      case 'variant_mismatch':
                        return { label: 'Variant Mismatch', className: 'bg-amber-100 text-amber-800 border-amber-200' };
                      case 'pack_size_mismatch':
                        return { label: 'Pack Size Mismatch', className: 'bg-blue-100 text-blue-800 border-blue-200' };
                      case 'market_mismatch':
                        return { label: 'Currency / Market Excluded', className: 'bg-slate-100 text-slate-800 border-slate-200' };
                      case 'statistical_outlier':
                        return { label: 'Statistical Outlier', className: 'bg-red-100 text-red-800 border-red-200' };
                      default:
                        return { label: 'Excluded', className: 'bg-slate-100 text-slate-700 border-slate-200' };
                    }
                  };
                  const rBadge = getReasonBadge(ex.reason);

                  return (
                    <Card
                      key={idx}
                      padding="md"
                      className="border-slate-200/90 bg-slate-50/50 hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <span className="text-[11px] font-mono text-slate-900 font-bold uppercase">
                            {ex.source}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${rBadge.className}`}>
                            {rBadge.label}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-800 mb-1.5 line-clamp-2">
                          {ex.title}
                        </h5>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1 mb-3">
                          <div className="text-slate-500 font-medium font-sans">
                            <strong>Reason:</strong> {ex.explanation}
                          </div>
                          {ex.price !== null && ex.price !== undefined && (
                            <div className="font-mono text-slate-700">
                              Observed value: {ex.price} {ex.currency || ''}
                            </div>
                          )}
                        </div>
                      </div>

                      {ex.url && ex.url.startsWith('http') && (
                        <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                          <a
                            href={ex.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 font-sans font-medium"
                          >
                            <span>Inspect source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No observations were excluded in this query.
              </div>
            )}
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

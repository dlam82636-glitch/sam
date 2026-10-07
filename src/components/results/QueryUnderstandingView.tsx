import React from 'react';
import {
  Sparkles,
  Search,
  AlertCircle,
  Tag,
  Sliders,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Layers,
  ArrowRight,
  GitBranch,
  Info,
} from 'lucide-react';
import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

export interface QueryUnderstandingViewProps {
  query: string;
  normalizedQuery: string;
  data: QueryUnderstandingResult;
  isCached?: boolean;
  onReset: () => void;
  onOpenArchitectureModal?: () => void;
}

export const QueryUnderstandingView: React.FC<QueryUnderstandingViewProps> = ({
  query,
  normalizedQuery,
  data,
  isCached = false,
  onReset,
  onOpenArchitectureModal,
}) => {
  const confidencePercent = Math.round(data.confidence * 100);

  const getConfidenceBadge = () => {
    if (confidencePercent >= 80) {
      return (
        <Badge variant="success" size="md">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          High Confidence ({confidencePercent}%)
        </Badge>
      );
    } else if (confidencePercent >= 50) {
      return (
        <Badge variant="info" size="md">
          <Info className="w-3.5 h-3.5 mr-1" />
          Moderate Confidence ({confidencePercent}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="warning" size="md">
          <AlertCircle className="w-3.5 h-3.5 mr-1" />
          Low / Ambiguous ({confidencePercent}%)
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Query Understanding Report</span>
            {isCached && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                deduplicated memory cache
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
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

      {/* Stage Status Banner (Prompts 3 & 4) */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/90 text-teal-950 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-xs uppercase tracking-wider text-teal-950">
                  AI Query-Understanding Stage Active
                </span>
                <Badge variant="teal" size="sm" className="font-mono text-[10px]">
                  Real Server-Side AI
                </Badge>
              </div>
              <p className="text-xs text-teal-900/90 mt-0.5 leading-relaxed">
                The product query has been parsed and structured into verified technical parameters by the server-side AI model. Web retrieval, supplier scraping, and pricing calculations are deliberately decoupled and will be connected in subsequent stages.
              </p>
            </div>
          </div>

          {onOpenArchitectureModal && (
            <button
              onClick={onOpenArchitectureModal}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-100/80 hover:bg-teal-200/70 border border-teal-300/80 text-teal-900 text-xs font-medium transition-colors cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Pipeline Specs</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Layout: Product Interpretation Card + Research Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Identified Product & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200/90 shadow-xs" padding="lg">
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <Badge variant="neutral" size="sm" className="font-mono">
                {data.category}
              </Badge>
              {data.material && (
                <>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Material: <strong className="text-slate-700">{data.material}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Canonical Name */}
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {data.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {data.description}
            </p>

            {/* Structured Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-slate-100">
              {data.brand && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Detected Brand / Manufacturer
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    {data.brand}
                  </span>
                </div>
              )}

              {data.model && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Detected Model / Series
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 font-mono">
                    {data.model}
                  </span>
                </div>
              )}

              {data.material && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Primary Material
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {data.material}
                  </span>
                </div>
              )}
            </div>

            {/* Extracted Specifications */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preserved Specifications & Measurements</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {data.specifications.length} detected
                </span>
              </div>

              {data.specifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.specifications.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80 font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No explicit dimensions or technical specifications provided in query.
                </p>
              )}
            </div>

            {/* Possible Variants */}
            {data.possible_variants && data.possible_variants.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Identified Variant Classes
                </span>
                <div className="space-y-1.5">
                  {data.possible_variants.map((variant, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{variant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (5 cols): Confidence, Research Queries & Uncertainties */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interpretation Confidence Card */}
          <Card className="border-slate-200/90 shadow-xs" padding="md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Interpretation Confidence
              </span>
              {getConfidenceBadge()}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Represents certainty that the query has been accurately disambiguated and translated into structured engineering parameters.
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidencePercent >= 80
                    ? 'bg-emerald-500'
                    : confidencePercent >= 50
                    ? 'bg-teal-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </Card>

          {/* Research Queries Prepared for Future Stage */}
          <Card className="border-slate-200/90 shadow-xs" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Generated Research Queries
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
              Targeted queries generated by the AI to dispatch to commercial distributors and technical catalogs in the future research stage.
            </p>

            <div className="space-y-2">
              {data.search_queries.map((sq, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 flex items-start gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="break-all">{sq}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Prospective queries: web search execution queued for Prompt 5.</span>
            </div>
          </Card>

          {/* Uncertainties & Ambiguities */}
          {data.uncertainties && data.uncertainties.length > 0 && (
            <Card className="border-slate-200/90 shadow-xs" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Reported Ambiguities & Missing Context
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Items requiring further user specification or market verification:
              </p>

              <ul className="space-y-2">
                {data.uncertainties.map((unc, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{unc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

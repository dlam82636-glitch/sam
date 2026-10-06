import React, { useState } from 'react';
import { SearchBar } from '@/src/components/search/SearchBar';
import { SearchSuggestions } from '@/src/components/search/SearchSuggestions';
import { PipelineProgress } from '@/src/components/search/PipelineProgress';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorState } from '@/src/components/common/ErrorState';
import { PrototypeBanner } from '@/src/components/results/PrototypeBanner';
import { PricingEstimateCard } from '@/src/components/results/PricingEstimateCard';
import { ProductSummaryCard } from '@/src/components/results/ProductSummaryCard';
import { SpecificationsTable } from '@/src/components/results/SpecificationsTable';
import { SourceAttributionList } from '@/src/components/results/SourceAttributionList';
import { AssumptionsCard } from '@/src/components/results/AssumptionsCard';
import { QueryInterpretationCard } from '@/src/components/results/QueryInterpretationCard';
import { executeResearchQuery } from '@/src/services/api/researchApi';
import { ResearchPipelineResult, PipelineStage } from '@/src/types';
import { Sparkles, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export interface HomePageProps {
  onOpenArchitectureModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenArchitectureModal }) => {
  const [query, setQuery] = useState<string>('');
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [result, setResult] = useState<ResearchPipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchTerm: string, simulateFailure = false) => {
    setQuery(searchTerm);
    setError(null);
    setResult(null);

    try {
      const res = await executeResearchQuery(searchTerm, {
        simulateFailure,
        onStageChange: (stage, message) => {
          setPipelineStage(stage);
          setStageMessage(message);
        },
      });

      setResult(res);
      setPipelineStage('completed');
    } catch (err: any) {
      setError(err?.message || 'An error occurred during query execution.');
      setPipelineStage('error');
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setPipelineStage('idle');
  };

  const isLoading =
    pipelineStage !== 'idle' &&
    pipelineStage !== 'completed' &&
    pipelineStage !== 'error';

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center mb-8 sm:mb-12" aria-labelledby="hero-title">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 text-xs font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Text-Search Market Intelligence Engine</span>
        </div>

        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]"
        >
          Research physical products & materials with market price clarity
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Type any material, industrial supply, or physical item. Explore normalized technical specifications and structured market price distributions backed by source citations.
        </p>
      </section>

      {/* Primary Search Experience */}
      <section aria-label="Product Search Input Section" className="mb-8">
        <SearchBar
          initialQuery={query}
          onSearch={(q) => handleSearch(q, false)}
          isLoading={isLoading}
        />

        <SearchSuggestions
          onSelectSuggestion={(suggestion) => handleSearch(suggestion, false)}
          disabled={isLoading}
        />
      </section>

      {/* Pipeline Loading State */}
      {isLoading && (
        <section aria-label="Pipeline Progress" aria-live="polite">
          <PipelineProgress
            currentStage={pipelineStage}
            stageMessage={stageMessage}
          />
        </section>
      )}

      {/* Error State */}
      {pipelineStage === 'error' && error && (
        <section aria-label="Error Notice">
          <ErrorState
            errorMessage={error}
            onRetry={() => handleSearch(query, false)}
            onReset={handleReset}
          />
        </section>
      )}

      {/* Results View */}
      {pipelineStage === 'completed' && result && (
        <section
          aria-label="Research Results"
          className="space-y-6 sm:space-y-8 animate-in fade-in duration-300"
        >
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                Research Report for:
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                "{result.rawQuery}"
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                New Search
              </Button>
            </div>
          </div>

          {/* Prototype Schema Disclaimer Banner */}
          {result.isMockData && (
            <PrototypeBanner onOpenArchitectureModal={onOpenArchitectureModal} />
          )}

          {/* Collapsible Query Interpretation & Dispatched Searches */}
          <QueryInterpretationCard interpretation={result.interpretation} />

          {/* Primary Layout: Pricing Estimate + Product Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Product Specifications & Identity */}
              <ProductSummaryCard product={result.product} />
              
              {/* Detailed Technical Specifications Table */}
              <SpecificationsTable specifications={result.product.specifications} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Market Price Estimate Card (Min, Median, Max) */}
              <PricingEstimateCard estimate={result.pricingEstimate} />

              {/* Assumptions & Operational Uncertainty */}
              <AssumptionsCard assumptions={result.pricingEstimate.assumptions} />
            </div>
          </div>

          {/* Source Attribution & Web Citations */}
          <div className="pt-4 border-t border-slate-200">
            <SourceAttributionList
              sources={result.sources}
              isMockData={result.isMockData}
            />
          </div>
        </section>
      )}

      {/* Default / Empty State */}
      {pipelineStage === 'idle' && (
        <EmptyState onSelectCategoryPrompt={(q) => handleSearch(q, false)} />
      )}
    </main>
  );
};

import React, { useState, useRef } from 'react';
import { SearchBar } from '@/src/components/search/SearchBar';
import { SearchSuggestions } from '@/src/components/search/SearchSuggestions';
import { PriceraPipeline } from '@/src/components/search/PriceraPipeline';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorState } from '@/src/components/common/ErrorState';
import { PriceraResultView } from '@/src/components/results/PriceraResultView';
import { HowItWorks } from '@/src/components/showcase/HowItWorks';
import { MarketSpotlight } from '@/src/components/showcase/MarketSpotlight';
import { executeSearchQuery } from '@/src/services/api/researchApi';
import { SignatureStageId, PriceraResearchResponse, SearchState } from '@/src/types/pipeline';
import { ShieldCheck, Sparkles } from 'lucide-react';

export interface HomePageProps {
  onOpenArchitectureModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenArchitectureModal }) => {
  const [query, setQuery] = useState<string>('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [currentStage, setCurrentStage] = useState<SignatureStageId>('understand');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [searchResponse, setSearchResponse] = useState<PriceraResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const isSearching =
    searchState === 'validating' ||
    searchState === 'understanding' ||
    searchState === 'researching' ||
    searchState === 'analyzing';

  const handleSearch = async (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm || isSearching) return;

    setQuery(cleanTerm);
    setError(null);
    setSearchResponse(null);
    setSearchState('validating');
    setCurrentStage('understand');
    setStageMessage('Understanding your product: Identifying product type, brand, specifications and variants.');

    try {
      const res = await executeSearchQuery(cleanTerm, {
        onStageTransition: (stage, message) => {
          setCurrentStage(stage);
          setStageMessage(message);
          if (stage === 'understand') setSearchState('understanding');
          else if (stage === 'research') setSearchState('researching');
          else if (stage === 'compare' || stage === 'estimate') setSearchState('analyzing');
        },
      });

      setSearchResponse(res);
      const isPartial = res.search?.status === 'partial' || res.pricing?.estimatedPrice === null;
      setSearchState(isPartial ? 'partial' : 'complete');

      // Subtle scroll to results on completion
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during query execution.';
      setError(msg);
      setSearchState('failed');
    }
  };

  const handleReset = () => {
    setQuery('');
    setSearchResponse(null);
    setError(null);
    setSearchState('idle');
    setCurrentStage('understand');
    setStageMessage('');
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* PRICERA Hero Brand Section with subtle ambient depth */}
      <section id="search" className="relative text-center mb-8 sm:mb-10 pt-4" aria-labelledby="hero-title">
        {/* Subtle ambient lighting behind hero */}
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal-500/10 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-semibold mb-4 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Know the market before you buy.</span>
        </div>

        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15] text-balance"
        >
          Product & material market research with evidence-backed price estimates
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Type any material, industrial supply, or physical item. PRICERA uncovers structured specifications, evaluates commercial listings, and calculates transparent market price benchmarks.
        </p>
      </section>

      {/* Primary Search Experience */}
      <section ref={searchBarRef} aria-label="Product Search Input Section" className="mb-8">
        <SearchBar
          initialQuery={query}
          onSearch={(q) => handleSearch(q)}
          isLoading={isSearching}
        />

        <SearchSuggestions
          onSelectSuggestion={(suggestion) => handleSearch(suggestion)}
          disabled={isSearching}
        />
      </section>

      {/* PRICERA Signature Pipeline (Understand -> Research -> Compare -> Estimate) */}
      {isSearching && (
        <section aria-label="Pipeline Progress" aria-live="polite" className="space-y-6">
          <PriceraPipeline
            currentStage={currentStage}
            stageMessage={stageMessage}
            isError={Boolean(error)}
          />

          {/* Skeleton Shimmer Loaders */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-75">
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="h-4 w-32 rounded animate-shimmer" />
              <div className="h-8 w-3/4 rounded animate-shimmer" />
              <div className="h-4 w-full rounded animate-shimmer" />
              <div className="h-4 w-2/3 rounded animate-shimmer" />
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="h-12 rounded animate-shimmer" />
                <div className="h-12 rounded animate-shimmer" />
                <div className="h-12 rounded animate-shimmer" />
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-12 w-48 bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-20 w-full bg-slate-800 rounded mt-6" />
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !isSearching && (
        <section aria-label="Error Notice">
          <ErrorState
            errorMessage={error}
            onRetry={() => handleSearch(query)}
            onReset={handleReset}
          />
        </section>
      )}

      {/* Results View: Full PRICERA Market Intelligence Report */}
      {searchResponse && !isSearching && (
        <section ref={resultsRef} aria-label="PRICERA Research Results">
          <PriceraResultView
            response={searchResponse}
            onReset={handleReset}
            onSearchAnother={(q) => handleSearch(q)}
            onOpenArchitectureModal={onOpenArchitectureModal}
          />
        </section>
      )}

      {/* Empty State when idle */}
      {!searchResponse && !isSearching && !error && (
        <EmptyState onSelectCategoryPrompt={(q) => handleSearch(q)} />
      )}

      {/* How It Works Feature Section */}
      <HowItWorks />

      {/* Market Spotlight: Continuous showcase */}
      <div className={searchResponse ? 'mt-16 pt-8 border-t border-slate-200/80 opacity-95' : 'mt-12'}>
        <MarketSpotlight onSelectQuery={(q) => handleSearch(q)} />
      </div>
    </main>
  );
};

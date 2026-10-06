import React, { useState } from 'react';
import { SearchBar } from '@/src/components/search/SearchBar';
import { SearchSuggestions } from '@/src/components/search/SearchSuggestions';
import { PriceraPipeline } from '@/src/components/search/PriceraPipeline';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorState } from '@/src/components/common/ErrorState';
import { PriceraResultView } from '@/src/components/results/PriceraResultView';
import { MarketSpotlight } from '@/src/components/showcase/MarketSpotlight';
import { executeSearchQuery } from '@/src/services/api/researchApi';
import { SignatureStageId, PriceraResearchResponse } from '@/src/types/pipeline';
import { ShieldCheck } from 'lucide-react';

export interface HomePageProps {
  onOpenArchitectureModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenArchitectureModal }) => {
  const [query, setQuery] = useState<string>('');
  const [currentStage, setCurrentStage] = useState<SignatureStageId>('understand');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResponse, setSearchResponse] = useState<PriceraResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    setError(null);
    setSearchResponse(null);
    setIsSearching(true);
    setCurrentStage('understand');
    setStageMessage('Initiating PRICERA research pipeline...');

    try {
      const res = await executeSearchQuery(searchTerm, {
        onStageTransition: (stage, message) => {
          setCurrentStage(stage);
          setStageMessage(message);
        },
      });

      setSearchResponse(res);
      setIsSearching(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during query execution.';
      setError(msg);
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSearchResponse(null);
    setError(null);
    setIsSearching(false);
    setCurrentStage('understand');
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* PRICERA Hero Section */}
      <section className="text-center mb-8 sm:mb-12" aria-labelledby="hero-title">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-semibold mb-4 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Know the market before you buy.</span>
        </div>

        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]"
        >
          Physical product research & transparent market price clarity
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Type any material, industrial supply, or physical item. PRICERA uncovers structured specifications, evaluates commercial listings, and calculates evidence-backed price ranges.
        </p>
      </section>

      {/* Primary Search Experience */}
      <section aria-label="Product Search Input Section" className="mb-8">
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
        <section aria-label="Pipeline Progress" aria-live="polite">
          <PriceraPipeline
            currentStage={currentStage}
            stageMessage={stageMessage}
            isError={Boolean(error)}
          />
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
        <section aria-label="PRICERA Research Results">
          <PriceraResultView
            response={searchResponse}
            onReset={handleReset}
            onOpenArchitectureModal={onOpenArchitectureModal}
          />
        </section>
      )}

      {/* Market Spotlight: Horizontal scrolling continuous product/brand showcase */}
      <MarketSpotlight onSelectQuery={(q) => handleSearch(q)} />

      {/* Default / Empty State */}
      {!searchResponse && !isSearching && !error && (
        <EmptyState onSelectCategoryPrompt={(q) => handleSearch(q)} />
      )}
    </main>
  );
};

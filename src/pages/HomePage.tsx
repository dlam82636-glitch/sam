import React, { useState, useRef } from 'react';
import { SearchBar } from '@/src/components/search/SearchBar';
import { SearchSuggestions } from '@/src/components/search/SearchSuggestions';
import { PriceraPipeline } from '@/src/components/search/PriceraPipeline';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ErrorState } from '@/src/components/common/ErrorState';
import { PriceraResultView } from '@/src/components/results/PriceraResultView';
import { HowItWorks } from '@/src/components/showcase/HowItWorks';
import { MarketSpotlight } from '@/src/components/showcase/MarketSpotlight';
import { HeroVisualComposition } from '@/src/components/hero/HeroVisualComposition';
import { executeSearchQuery } from '@/src/services/api/researchApi';
import { SignatureStageId, PriceraResearchResponse, SearchState } from '@/src/types/pipeline';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Lock, FileSearch } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

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

      // Smooth scroll to results on completion
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
    <main className="flex-1 w-full overflow-hidden">
      {/* 1. ASYMMETRIC DIMENSIONAL HERO */}
      <section
        id="search"
        ref={searchBarRef}
        aria-labelledby="hero-title"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-14 sm:pb-24"
      >
        {/* Ambient atmospheric depth lighting */}
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[45rem] h-[35rem] hero-radial-glow blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT / PRIMARY EDITORIAL CONTENT (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8 z-10">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 border border-teal-200/90 text-[#0F766E] text-xs font-bold uppercase font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>PRICERA MARKET INTELLIGENCE</span>
            </div>

            {/* Large Editorial Headline */}
            <h1
              id="hero-title"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black text-slate-900 tracking-[-0.04em] leading-[0.98] text-balance"
            >
              Know the market <span className="block text-teal-800">before you buy.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed text-balance">
              Search a product or material and discover what the market is actually charging — backed by real sources when available.
            </p>

            {/* Integrated Search Interface */}
            <div className="pt-2 max-w-xl">
              <SearchBar
                initialQuery={query}
                onSearch={(q) => handleSearch(q)}
                isLoading={isSearching}
              />

              <div className="mt-3">
                <SearchSuggestions
                  onSelectSuggestion={(suggestion) => handleSearch(suggestion)}
                  disabled={isSearching}
                />
              </div>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Zero Fabricated Quotes</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Verified Supplier Catalogs</span>
              </span>
            </div>
          </div>

          {/* RIGHT / 3D FLOATING VISUAL COMPOSITION (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
            <HeroVisualComposition onSelectQuery={(q) => handleSearch(q)} />
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKET INDICATOR & TRUST TICKER STRIP */}
      <section
        aria-label="Market Coverage Overview"
        className="w-full border-y border-slate-200/80 bg-white/70 backdrop-blur-md py-4 sm:py-5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
            <span>Active Catalog Coverage:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-600 font-medium">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px]">
              • Construction & Timber
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px]">
              • Industrial Piping & Metals
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px]">
              • Commercial Hardware
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px]">
              • Safety & PPE Gear
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px]">
              • Workspace Furniture
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 3. PRICERA SIGNATURE PIPELINE (Shown during search) */}
        {isSearching && (
          <section aria-label="Pipeline Progress" aria-live="polite" className="my-10 space-y-6">
            <PriceraPipeline
              currentStage={currentStage}
              stageMessage={stageMessage}
              isError={Boolean(error)}
            />

            {/* Skeleton Shimmer Loaders with Glass Depth */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-90">
              <div className="lg:col-span-7 p-7 rounded-3xl glass-panel space-y-4">
                <div className="h-4 w-36 rounded-full animate-shimmer" />
                <div className="h-8 w-3/4 rounded-xl animate-shimmer" />
                <div className="h-4 w-full rounded-lg animate-shimmer" />
                <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="h-16 rounded-xl animate-shimmer" />
                  <div className="h-16 rounded-xl animate-shimmer" />
                  <div className="h-16 rounded-xl animate-shimmer" />
                </div>
              </div>

              <div className="lg:col-span-5 p-7 rounded-3xl glass-panel-dark space-y-4 text-white">
                <div className="h-4 w-32 bg-slate-800 rounded-full animate-pulse" />
                <div className="h-12 w-52 bg-slate-800 rounded-xl animate-pulse" />
                <div className="h-4 w-full bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-24 w-full bg-slate-800/80 rounded-xl mt-6 animate-pulse" />
              </div>
            </div>
          </section>
        )}

        {/* 4. ERROR STATE */}
        {error && !isSearching && (
          <section aria-label="Error Notice" className="my-10">
            <ErrorState
              errorMessage={error}
              onRetry={() => handleSearch(query)}
              onReset={handleReset}
            />
          </section>
        )}

        {/* 5. RESULTS VIEW: Full PRICERA Market Intelligence Report */}
        {searchResponse && !isSearching && (
          <section ref={resultsRef} aria-label="PRICERA Research Results" className="my-12">
            <PriceraResultView
              response={searchResponse}
              onReset={handleReset}
              onSearchAnother={(q) => handleSearch(q)}
              onOpenArchitectureModal={onOpenArchitectureModal}
            />
          </section>
        )}

        {/* 6. EMPTY STATE (When idle) */}
        {!searchResponse && !isSearching && !error && (
          <EmptyState onSelectCategoryPrompt={(q) => handleSearch(q)} />
        )}

        {/* 7. HOW IT WORKS (Connected Pipeline Composition) */}
        <HowItWorks />
      </div>

      {/* 8. MARKET SPOTLIGHT (Continuous Marquee with 6 Uploaded Images) */}
      <MarketSpotlight onSelectQuery={(q) => handleSearch(q)} />

      {/* 9. EVIDENCE & VERIFICATION PRINCIPLES (Dimensional Storytelling Section) */}
      <section
        aria-label="PRICERA Verification Standard"
        className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-28"
      >
        <div className="rounded-3xl glass-panel-dark text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Subtle teal background glow */}
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 hero-orb-teal blur-3xl opacity-60" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Attribution Safeguard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Evidence First. Never Synthetic.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
              PRICERA adheres to a strict zero-fabrication protocol. If a live search provider is not connected or returns insufficient observations, we declare that pricing data is unavailable rather than generating simulated numbers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <h4 className="font-bold text-white text-base mb-1">Verifiable Citations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every price datum maps to an authentic distributor URL, domain, and retrieval date.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">Statistical Median</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Screen extreme outlier quotes using Interquartile Range (IQR) filtering.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">Unit Normalization</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Prices are harmonized to standard units of measure (e.g. per sheet, per meter, per unit).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL SEARCH CALL TO ACTION */}
      <section
        aria-label="Ready to research CTA"
        className="max-w-4xl mx-auto px-4 sm:px-6 my-16 text-center"
      >
        <div className="rounded-3xl glass-panel p-8 sm:p-12 shadow-xl border border-white space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ready to research a product?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Enter any construction material, industrial part, or consumer device to check real market pricing.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              pill
              onClick={() => {
                searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = document.getElementById('product-search-input');
                input?.focus();
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-8 py-4 text-base font-bold shadow-lg shadow-teal-900/20"
            >
              Start Market Search
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

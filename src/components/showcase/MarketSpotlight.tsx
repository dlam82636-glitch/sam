import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface SpotlightProduct {
  id: string;
  name: string;
  category: string;
  imageSrc: string;
  altText: string;
  searchQuery: string;
}

const SPOTLIGHT_PRODUCTS: SpotlightProduct[] = [
  {
    id: 'spotlight-ac',
    name: 'Air Conditioner',
    category: 'Home & Appliance',
    imageSrc: '/images/air_conditioner.jpg',
    altText: 'Air Conditioner - Home & Appliance',
    searchQuery: 'split air conditioner',
  },
  {
    id: 'spotlight-hardhat',
    name: 'Construction Hard Hat',
    category: 'Construction & Safety',
    imageSrc: '/images/hard_hat.jpg',
    altText: 'Construction Hard Hat - Construction & Safety',
    searchQuery: 'industrial safety helmet',
  },
  {
    id: 'spotlight-chair',
    name: 'Ergonomic Office Chair',
    category: 'Office & Workspace',
    imageSrc: '/images/office_chair.jpg',
    altText: 'Ergonomic Office Chair - Office & Workspace',
    searchQuery: 'ergonomic office chair',
  },
  {
    id: 'spotlight-watch',
    name: 'Smartwatch',
    category: 'Consumer Electronics',
    imageSrc: '/images/smartwatch.jpg',
    altText: 'Smartwatch - Consumer Electronics',
    searchQuery: 'smartwatch',
  },
  {
    id: 'spotlight-laptop',
    name: 'MacBook',
    category: 'Computing',
    imageSrc: '/images/macbook_laptop.jpg',
    altText: 'MacBook Laptop - Computing',
    searchQuery: 'MacBook laptop',
  },
  {
    id: 'spotlight-phone',
    name: 'Samsung Galaxy Phone',
    category: 'Mobile Technology',
    imageSrc: '/images/galaxy_phone.jpg',
    altText: 'Samsung Galaxy Phone - Mobile Technology',
    searchQuery: 'Samsung Galaxy phone',
  },
];

export interface MarketSpotlightProps {
  onSelectQuery?: (query: string) => void;
}

export const MarketSpotlight: React.FC<MarketSpotlightProps> = ({ onSelectQuery }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pauseBriefly = (durationMs = 4000) => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, durationMs);
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    pauseBriefly(5000);
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleTouchStart = () => {
    pauseBriefly(6000);
  };

  const handleTouchEnd = () => {
    pauseBriefly(3000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const renderCard = (product: SpotlightProduct, isDuplicate: boolean) => (
    <article
      key={`${isDuplicate ? 'dup' : 'orig'}-${product.id}`}
      aria-hidden={isDuplicate ? 'true' : undefined}
      tabIndex={isDuplicate ? -1 : 0}
      role="button"
      aria-label={`Research ${product.name} with PRICERA`}
      onClick={() => onSelectQuery?.(product.searchQuery)}
      onKeyDown={(e) => {
        if (!isDuplicate && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelectQuery?.(product.searchQuery);
        }
      }}
      className="group relative shrink-0 w-[280px] sm:w-[320px] glass-panel rounded-3xl p-5 shadow-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-900/10 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top subtle teal highlight accent on hover */}
      <div className="absolute top-0 left-6 right-6 h-1 bg-transparent group-hover:bg-teal-500 rounded-full transition-colors duration-300" />

      <div>
        {/* Product Image Stage (Preserves proportions & transparency) */}
        <div className="h-48 sm:h-52 w-full rounded-2xl bg-white/70 group-hover:bg-white p-4 mb-4 flex items-center justify-center overflow-hidden border border-slate-150 transition-colors duration-300 shadow-2xs">
          <img
            src={product.imageSrc}
            alt={isDuplicate ? '' : product.altText}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out select-none pointer-events-none"
          />
        </div>

        {/* Category & Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-teal-700 tracking-wider uppercase font-mono block">
            {product.category}
          </span>
          <h4 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-teal-950 transition-colors tracking-tight line-clamp-1">
            {product.name}
          </h4>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-900 transition-colors">
        <span>Explore with PRICERA</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
      </div>
    </article>
  );

  return (
    <section
      id="spotlight"
      aria-label="Market Spotlight Product Showcase"
      className="w-full my-16 sm:my-24 pt-10 pb-14 border-y border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 overflow-hidden relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
                Market Spotlight
              </h3>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                · Interactive Product Showcase
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Explore products and materials you can research with PRICERA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono mr-2 hidden sm:inline">
              Pause on hover · Click to research
            </span>
            {/* Accessible Manual Controls */}
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-teal-800 hover:border-teal-600 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
              aria-label="Scroll spotlight left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-teal-800 hover:border-teal-600 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
              aria-label="Scroll spotlight right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Track with subtle edge fades */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left edge gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />
        {/* Right edge gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Marquee Viewport */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Scrolling product showcase"
          className="w-full overflow-x-auto no-scrollbar scroll-smooth focus:outline-none"
        >
          {/* Continuous Moving Track: pauses on hover/focus/touch */}
          <div
            className={`flex w-max py-3 select-none animate-marquee ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {/* Track 1 (Accessible for screen readers) */}
            <div className="flex shrink-0 items-stretch gap-6 pr-6">
              {SPOTLIGHT_PRODUCTS.map((product) => renderCard(product, false))}
            </div>

            {/* Track 2 (Exact duplicate for seamless infinite loop) */}
            <div className="flex shrink-0 items-stretch gap-6 pr-6" aria-hidden="true">
              {SPOTLIGHT_PRODUCTS.map((product) => renderCard(product, true))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

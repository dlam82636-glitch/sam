import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export interface SpotlightItem {
  id: string;
  badge: string;
  brand: string;
  product: string;
  category: string;
  description: string;
  specsSummary: string;
  actionText: string;
  searchQuery: string;
}

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 'spotlight-1',
    badge: 'Demo Spec',
    brand: 'Samsung',
    product: 'Galaxy A55 5G (256GB)',
    category: 'Consumer Electronics',
    description: 'High-efficiency 5G mid-ranger with aluminum chassis and Super AMOLED 120Hz display.',
    specsSummary: '256GB Storage · 8GB RAM · 50MP OIS',
    actionText: 'Research Market Spec',
    searchQuery: 'Samsung A55 256GB',
  },
  {
    id: 'spotlight-2',
    badge: 'Demo Spec',
    brand: 'TimberCore Solutions',
    product: 'BS 1088 Marine Plywood (12mm)',
    category: 'Building Materials',
    description: 'Moisture-sealed phenolic hardwood core engineered for boatbuilding and humid wet rooms.',
    specsSummary: '12mm Nominal · 2440×1220mm · WBP Resin',
    actionText: 'Research Market Spec',
    searchQuery: '12mm marine plywood',
  },
  {
    id: 'spotlight-3',
    badge: 'Demo Spec',
    brand: 'ErgoForm Commercial',
    product: 'Vanguard Ergonomic Task Chair',
    category: 'Commercial Furniture',
    description: 'BIFMA-certified breathable elastomeric mesh with synchro-tilt mechanism and 4D arms.',
    specsSummary: '300 lbs Rating · ANSI/BIFMA · 4D Armrests',
    actionText: 'Research Market Spec',
    searchQuery: 'office chair',
  },
  {
    id: 'spotlight-4',
    badge: 'Demo Spec',
    brand: 'Apex Piping & Alloy',
    product: '2-inch Stainless Steel Pipe Sch 40',
    category: 'Metals & Piping',
    description: 'ASTM A312 TP304 welded pressure piping for food, chemical, and architectural handrails.',
    specsSummary: '2" NPS · Schedule 40 · 304 Stainless',
    actionText: 'Research Market Spec',
    searchQuery: 'stainless steel pipe 2 inch',
  },
  {
    id: 'spotlight-5',
    badge: 'Demo Spec',
    brand: 'ProSubstrate Systems',
    product: 'Cement Backer Board 1/2 in.',
    category: 'Tile Substrates',
    description: 'Portland cement core with polymer-coated fiberglass mesh reinforcement for wet areas.',
    specsSummary: '1/2 in. · 3ft × 5ft · Class A Non-Combustible',
    actionText: 'Research Market Spec',
    searchQuery: 'cement board',
  },
  {
    id: 'spotlight-6',
    badge: 'Demo Spec',
    brand: 'Industrial Shield PPE',
    product: 'ANSI Type 1 Ratchet Hard Hat',
    category: 'Safety Equipment',
    description: 'High-density polyethylene shell certified to 20,000V electrical shock protection.',
    specsSummary: 'Class E Dielectric · 6-Point Ratchet · ~380g',
    actionText: 'Research Market Spec',
    searchQuery: 'industrial safety helmet',
  },
];

export interface MarketSpotlightProps {
  onSelectQuery?: (query: string) => void;
}

export const MarketSpotlight: React.FC<MarketSpotlightProps> = ({ onSelectQuery }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...SPOTLIGHT_ITEMS, ...SPOTLIGHT_ITEMS];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="spotlight"
      aria-label="Market Spotlight Product Showcase"
      className="w-full my-14 pt-8 pb-10 border-y border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                Market Spotlight
              </h3>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                · Representative Product Showcase
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select any example product or material to research live market specifications and pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono mr-2 hidden sm:inline">
              Pause on hover · Click to inspect
            </span>
            {/* Accessible Manual Controls */}
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-teal-800 hover:border-teal-500 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Scroll spotlight left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-teal-800 hover:border-teal-500 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Scroll spotlight right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Wrapper with subtle side fade masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        {/* Right gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        {/* Scrolling track */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Scrolling product showcase"
          className="animate-marquee flex gap-4 px-4 select-none focus:outline-none overflow-x-auto scrollbar-none"
        >
          {marqueeItems.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="group shrink-0 w-[290px] sm:w-[320px] bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
              onClick={() => onSelectQuery?.(item.searchQuery)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectQuery?.(item.searchQuery);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Inspect ${item.product} by ${item.brand}`}
            >
              <div>
                {/* Header metadata */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60 font-medium">
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.category}
                  </span>
                </div>

                {/* Brand & Product */}
                <div className="text-[11px] font-semibold text-teal-700 tracking-wider uppercase mb-0.5">
                  {item.brand}
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-900 transition-colors line-clamp-1">
                  {item.product}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Specs box */}
                <div className="mt-3 p-2 rounded bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600">
                  {item.specsSummary}
                </div>
              </div>

              {/* Action link */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-900 transition-colors">
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

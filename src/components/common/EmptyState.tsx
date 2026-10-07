import React from 'react';
import { Hammer, HardHat, Cpu, Armchair, Pipette, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export interface EmptyStateProps {
  onSelectCategoryPrompt: (query: string) => void;
}

const PRIMARY_EXAMPLES = [
  '12mm marine plywood',
  'Samsung A55',
  'industrial safety helmet',
  '2 inch stainless steel pipe',
  'cement board',
  'office chair',
];

const CATEGORIES = [
  {
    icon: Hammer,
    categoryTag: 'Building & Timber',
    title: 'Marine Plywood & Lumber',
    description: 'BS 1088 marine plywood, structural timber, drywall, cement board, insulation',
    sampleQuery: '12mm marine plywood',
  },
  {
    icon: Pipette,
    categoryTag: 'Industrial Metals',
    title: 'Piping & Structural Tubing',
    description: 'Stainless steel pipe, structural tubing, brass fittings, schedule 40 line',
    sampleQuery: '2 inch stainless steel pipe',
  },
  {
    icon: HardHat,
    categoryTag: 'PPE & Safety Gear',
    title: 'Industrial Safety Helmets',
    description: 'ANSI Type 1 hard hats, fall protection harnesses, eye & ear protection',
    sampleQuery: 'industrial safety helmet',
  },
  {
    icon: Cpu,
    categoryTag: 'Hardware & Tech',
    title: 'Commercial Devices & Mobile',
    description: 'Commercial hardware, handheld scanners, instrumentation, smartphones',
    sampleQuery: 'Samsung A55',
  },
  {
    icon: Armchair,
    categoryTag: 'Commercial Interiors',
    title: 'Ergonomic Office Seating',
    description: 'BIFMA office chairs, height-adjustable desks, acoustic panels',
    sampleQuery: 'office chair',
  },
  {
    icon: Search,
    categoryTag: 'Substrates',
    title: 'Cement & Tile Backer Boards',
    description: 'Cement backer boards, waterproofing membranes, structural underlayment',
    sampleQuery: 'cement board',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectCategoryPrompt }) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-12 sm:my-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-10">
        <Badge variant="teal" size="md" className="mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Market Intelligence Engine</span>
        </Badge>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          What are you looking for?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2.5 leading-relaxed">
          Search for a product, material, or equipment specification to research commercial pricing and verified source quotes.
        </p>

        {/* Quick-Start Example Chips */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 select-none">
            Popular searches:
          </span>
          {PRIMARY_EXAMPLES.map((eg) => (
            <button
              key={eg}
              type="button"
              onClick={() => onSelectCategoryPrompt(eg)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-teal-950 hover:border-teal-500 hover:bg-teal-50/60 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {eg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Card
              key={i}
              padding="md"
              hoverEffect
              className="group cursor-pointer flex flex-col justify-between border-slate-200/80 hover:border-teal-600/40"
              onClick={() => onSelectCategoryPrompt(cat.sampleQuery)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs group-hover:bg-teal-700 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                    {cat.categoryTag}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-950 transition-colors mb-1.5 tracking-tight">
                  {cat.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-900 transition-colors">
                <span>Research "{cat.sampleQuery}"</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Hammer, HardHat, Cpu, Armchair, Pipette, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export interface EmptyStateProps {
  onSelectCategoryPrompt: (query: string) => void;
}

const CATEGORIES = [
  {
    icon: Hammer,
    title: 'Building Materials & Timber',
    description: 'Plywood, structural timber, drywall, cement board, insulation',
    sampleQuery: '12mm marine plywood',
  },
  {
    icon: Pipette,
    title: 'Industrial Piping & Metals',
    description: 'Stainless steel pipe, structural tubing, brass fittings, copper line',
    sampleQuery: 'stainless steel pipe 2 inch',
  },
  {
    icon: HardHat,
    title: 'Safety Equipment & PPE',
    description: 'ANSI hard hats, fall protection harnesses, respirators, eye protection',
    sampleQuery: 'industrial safety helmet',
  },
  {
    icon: Cpu,
    title: 'Hardware & Electronics',
    description: 'Industrial sensors, commercial devices, instrumentation, smartphones',
    sampleQuery: 'Samsung A55',
  },
  {
    icon: Armchair,
    title: 'Commercial Outfitting',
    description: 'BIFMA office seating, workstations, storage racking, acoustic panels',
    sampleQuery: 'office chair',
  },
  {
    icon: Search,
    title: 'Substrates & Tile Backers',
    description: 'Cement backer boards, waterproofing membranes, underlayment',
    sampleQuery: 'cement board',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectCategoryPrompt }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Scope of Research Intelligence
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Search physical products by specification, grade, or common name
        </p>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2">
          Enter any physical material, industrial item, or commercial product. MarketSpec structures technical parameters and tracks transparent market price boundaries.
        </p>
      </div>

      {/* Grid of Product Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Card
              key={i}
              padding="md"
              hoverEffect
              className="group cursor-pointer flex flex-col justify-between border-slate-200"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-50 border border-slate-200/80 group-hover:border-indigo-200 flex items-center justify-center text-slate-700 group-hover:text-indigo-600 transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-900 transition-colors mb-1">
                  {cat.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectCategoryPrompt(cat.sampleQuery)}
                className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-indigo-600 transition-colors text-left"
              >
                <span>Try "{cat.sampleQuery}"</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Card>
          );
        })}
      </div>

      {/* Pro-Tips for Search Accuracy */}
      <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 block mb-0.5">
              Tip for Best Research Precision
            </span>
            <span>
              Include dimensions (e.g. <em>12mm</em>, <em>2 inch</em>), material grades (e.g. <em>marine BS1088</em>, <em>Grade 304</em>), or storage capacities to narrow the market price range.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Tag } from 'lucide-react';

export interface SearchSuggestionsProps {
  onSelectSuggestion: (query: string) => void;
  disabled?: boolean;
}

const EXAMPLE_SUGGESTIONS = [
  { label: '12mm marine plywood', category: 'Timber / Sheet' },
  { label: 'cement board', category: 'Substrates' },
  { label: 'Samsung A55', category: 'Electronics' },
  { label: 'industrial safety helmet', category: 'PPE / Safety' },
  { label: 'stainless steel pipe 2 inch', category: 'Metals & Piping' },
  { label: 'office chair', category: 'Commercial Furniture' },
];

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelectSuggestion,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mr-1">
          <Tag className="w-3.5 h-3.5 text-slate-600" />
          <span>Try examples:</span>
        </span>

        {EXAMPLE_SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(item.label)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs text-slate-700 hover:text-slate-900 hover:border-indigo-300 hover:bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            <span className="font-medium group-hover:text-indigo-900">{item.label}</span>
            <span className="text-[10px] text-slate-600 group-hover:text-indigo-700 font-mono hidden sm:inline">
              • {item.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

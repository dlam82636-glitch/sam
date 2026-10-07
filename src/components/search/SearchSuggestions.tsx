import React from 'react';

export interface SearchSuggestionsProps {
  onSelectSuggestion: (query: string) => void;
  disabled?: boolean;
}

const EXAMPLE_SUGGESTIONS = [
  '12mm marine plywood',
  'Samsung A55',
  'industrial safety helmet',
  '2 inch stainless steel pipe',
  'cement board',
  'office chair',
];

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelectSuggestion,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 select-none">
          Try searching:
        </span>
        {EXAMPLE_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(item)}
            className="group inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-teal-950 hover:border-teal-500 hover:bg-teal-50/50 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 tracking-tight"
          >
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

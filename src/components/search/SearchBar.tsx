import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { validateProductQuery } from '@/src/lib/validation';

export interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const validation = validateProductQuery(inputValue);

    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Please enter a valid query');
      inputRef.current?.focus();
      return;
    }

    setValidationError(null);
    setWarningMessage(validation.warningMessage || null);
    onSearch(validation.sanitizedQuery);
  };

  const handleClear = () => {
    setInputValue('');
    setValidationError(null);
    setWarningMessage(null);
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (validationError && val.trim().length > 0) {
      setValidationError(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200/95 shadow-md hover:border-slate-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/15 transition-all duration-200">
          {/* Leading Search Icon */}
          <div className="pl-4 sm:pl-5 pr-2 text-slate-400 pointer-events-none flex items-center">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700" aria-hidden="true" />
          </div>

          {/* Text Input */}
          <label htmlFor="product-search-input" className="sr-only">
            Search for a physical product, material, item, or specification
          </label>
          <input
            id="product-search-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Search for a product or material... (e.g. 12mm marine plywood, cement board)"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            maxLength={200}
            className="w-full py-4 sm:py-5 text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-transparent focus:outline-none disabled:opacity-60"
            aria-describedby={validationError ? 'search-error-message' : undefined}
          />

          {/* Clear Button */}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors mr-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Clear search input"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Primary Action Button */}
          <div className="pr-2 sm:pr-3 shrink-0">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="px-5 sm:px-7 font-bold tracking-tight shadow-sm hover:scale-[1.02] active:scale-100 transition-all duration-150"
              aria-label="Execute search"
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Validation or Format Warnings */}
      {validationError && (
        <div
          id="search-error-message"
          role="alert"
          className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      {warningMessage && !validationError && (
        <div
          role="status"
          className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs animate-in fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{warningMessage}</span>
        </div>
      )}
    </div>
  );
};

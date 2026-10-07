import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertCircle, ArrowRight } from 'lucide-react';
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
      setValidationError(validation.errorMessage || 'Please enter a valid product or material query');
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-slate-200/90 shadow-hero-input hover:border-slate-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/15 focus-within:shadow-[0_20px_40px_-8px_rgba(15,118,110,0.18)] focus-within:-translate-y-0.5 transition-all duration-250 p-1.5 sm:p-2">
          {/* Leading Search Icon */}
          <div className="pl-4 sm:pl-5 pr-2.5 text-teal-700 pointer-events-none flex items-center shrink-0">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
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
            placeholder="Search a product, material or specification..."
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            maxLength={200}
            className="w-full py-3.5 sm:py-4 text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-transparent focus:outline-none disabled:opacity-60 tracking-tight"
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
          <div className="shrink-0">
            <Button
              type="submit"
              variant="primary"
              size="md"
              pill
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-5 sm:px-6 py-3.5 text-sm sm:text-base font-bold shadow-md shadow-teal-950/20 tracking-tight"
              aria-label="Research Market Price"
            >
              <span className="hidden sm:inline">Research market</span>
              <span className="sm:hidden">Research</span>
            </Button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div
            id="search-error-message"
            role="alert"
            className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Warning Notification */}
        {warningMessage && !validationError && (
          <div
            role="status"
            className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

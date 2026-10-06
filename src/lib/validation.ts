/**
 * Input Validation Utilities for MarketSpec
 * Validates text-search queries prior to dispatching them to research pipelines.
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedQuery: string;
  errorMessage?: string;
  warningMessage?: string;
}

export function validateProductQuery(rawQuery: string): ValidationResult {
  const trimmed = rawQuery.trim();

  // 1. Empty Check
  if (!trimmed) {
    return {
      isValid: false,
      sanitizedQuery: '',
      errorMessage: 'Please enter a product, material, or specification name to search.',
    };
  }

  // 2. Minimum Length Check
  if (trimmed.length < 2) {
    return {
      isValid: false,
      sanitizedQuery: trimmed,
      errorMessage: 'Search query is too short. Please provide at least 2 characters.',
    };
  }

  // 3. Maximum Length Check (prevent massive prompt flooding)
  if (trimmed.length > 200) {
    return {
      isValid: false,
      sanitizedQuery: trimmed.slice(0, 200),
      errorMessage: 'Query exceeds 200 characters. Please provide a more concise product or material term.',
    };
  }

  // 4. Pure symbol or non-alphanumeric check
  const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmed);
  if (!hasAlphanumeric) {
    return {
      isValid: false,
      sanitizedQuery: trimmed,
      errorMessage: 'Please enter a valid product name with letters or numbers.',
    };
  }

  // 5. Sanitization (strip control chars, normalize whitespace)
  const sanitized = trimmed.replace(/\s+/g, ' ');

  // 6. Helpful warning for single generic words
  let warningMessage: string | undefined;
  if (!sanitized.includes(' ') && sanitized.length < 4) {
    warningMessage = 'Short generic terms may return broad estimates. Adding specifications (e.g., size, grade) improves accuracy.';
  }

  return {
    isValid: true,
    sanitizedQuery: sanitized,
    warningMessage,
  };
}

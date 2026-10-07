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

  // 4. Pure symbol or non-alphanumeric check (Unicode-aware: supports accented letters, Cyrillic, Asian scripts, etc.)
  const hasAlphanumeric = /[a-zA-Z0-9]|\p{L}|\p{N}/u.test(trimmed);
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

/**
 * Server-side request validator for search payloads.
 * Enforces strict type boundaries on untrusted HTTP input.
 */
export interface ServerValidationResult {
  isValid: boolean;
  sanitizedQuery: string;
  statusCode?: number;
  errorMessage?: string;
}

export function validateServerSearchRequest(body: unknown): ServerValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      sanitizedQuery: '',
      statusCode: 400,
      errorMessage: 'Invalid request body. Expected a JSON object with a "query" field.',
    };
  }

  const { query } = body as Record<string, unknown>;

  if (query === undefined || query === null) {
    return {
      isValid: false,
      sanitizedQuery: '',
      statusCode: 400,
      errorMessage: 'Missing "query" parameter in request body.',
    };
  }

  if (typeof query !== 'string') {
    return {
      isValid: false,
      sanitizedQuery: '',
      statusCode: 400,
      errorMessage: 'The "query" parameter must be a string.',
    };
  }

  // Strip non-printable ASCII control characters (keep standard spacing, unicode letters, math/spec symbols)
  const cleaned = query.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  if (cleaned.length === 0) {
    return {
      isValid: false,
      sanitizedQuery: '',
      statusCode: 400,
      errorMessage: 'Query must not be empty.',
    };
  }

  if (cleaned.length < 2) {
    return {
      isValid: false,
      sanitizedQuery: cleaned,
      statusCode: 400,
      errorMessage: 'Query is too short. Please provide at least 2 characters.',
    };
  }

  const MAX_QUERY_LENGTH = 200;
  if (cleaned.length > MAX_QUERY_LENGTH) {
    return {
      isValid: false,
      sanitizedQuery: cleaned.slice(0, MAX_QUERY_LENGTH),
      statusCode: 400,
      errorMessage: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters.`,
    };
  }

  // Check for at least one letter or digit (Unicode-aware: supports all scripts and accented characters)
  if (!(/[a-zA-Z0-9]|\p{L}|\p{N}/u.test(cleaned))) {
    return {
      isValid: false,
      sanitizedQuery: cleaned,
      statusCode: 400,
      errorMessage: 'Query must contain at least one alphanumeric character.',
    };
  }

  // Normalize multi-spaces
  const normalized = cleaned.replace(/\s+/g, ' ');

  return {
    isValid: true,
    sanitizedQuery: normalized,
  };
}

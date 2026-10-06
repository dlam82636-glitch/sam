/**
 * Query Understanding Result Schema (Prompts 3 & 4)
 * Strict structured representation of user intent, product identification,
 * extracted parameters, search queries for future research, and ambiguity reports.
 */

export interface QueryUnderstandingResult {
  name: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[];
  possible_variants: string[];
  search_queries: string[];
  confidence: number; // 0.0 - 1.0 (interpretation confidence, NOT price confidence)
  uncertainties: string[];
}

export interface SearchApiResponse {
  success: boolean;
  query: string;
  normalizedQuery: string;
  data?: QueryUnderstandingResult;
  error?: string;
  code?: string;
  cached?: boolean;
}

/**
 * Research & Source Attribution Type Definitions (Prompts 5 & 6)
 * Represents real external web research findings, normalized product listings,
 * and retrieval status from commercial suppliers and distributors.
 */

export interface NormalizedResearchResult {
  source: string;
  title: string;
  url: string;
  seller: string | null;
  brand: string | null;
  product: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  specifications: string[];
  retrievedAt: string;
  rawSnippet?: string;
  isRelevantMatch?: boolean;
}

export type ResearchStatus =
  | 'idle'
  | 'searching'
  | 'success'
  | 'no_results'
  | 'provider_unconfigured'
  | 'rate_limited'
  | 'error';

export interface ResearchServiceResponse {
  status: ResearchStatus;
  provider: string;
  results: NormalizedResearchResult[];
  executedQueries: string[];
  totalFound: number;
  message?: string;
}

export interface SourceObservation {
  id: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  pageTitle: string;
  observedPrice: number;
  currency: string;
  unitOfMeasure: string;
  observationDate: string;
  sourceType: 'retailer' | 'distributor' | 'manufacturer' | 'marketplace' | 'trade_supplier';
  extractedSnippet: string;
  specMatchScore: number;
  isVerified: boolean;
}

export interface GeneratedSearchQuery {
  query: string;
  intent: 'supplier_lookup' | 'spec_sheet' | 'price_check' | 'variant_discovery';
  targetAudience: 'b2b_wholesale' | 'contractor' | 'retail';
}

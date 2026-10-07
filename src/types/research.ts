/**
 * Research & Source Attribution Type Definitions (Prompts 5 & 6)
 * Represents real external web research findings, normalized product listings,
 * and retrieval status from commercial suppliers and distributors.
 */

export type SourceClassification =
  | 'PRICE_SOURCE'
  | 'SPECIFICATION_SOURCE'
  | 'MANUFACTURER_SOURCE'
  | 'MARKETPLACE'
  | 'RETAILER'
  | 'DISTRIBUTOR'
  | 'GENERAL_REFERENCE';

export type SourceRole =
  // Commercial price sources
  | 'retailer'
  | 'marketplace'
  | 'distributor'
  | 'manufacturer_store'
  | 'official_brand_store'
  | 'commercial_listing'
  // Reference sources
  | 'manufacturer_information'
  | 'specification_reference'
  | 'review'
  | 'news'
  | 'blog'
  | 'general_information';

export type SourceRoleGroup = 'PRICE_EVIDENCE' | 'REFERENCE_RESEARCH';

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
  classification?: SourceClassification;
  sourceRole?: SourceRole;
  sourceRoleGroup?: SourceRoleGroup;
  isCommercialPriceSource?: boolean;
  isNigerianSource?: boolean;
  location?: string | null;
  unit?: string | null;
  packQuantity?: number | null;
  packUnit?: string | null;
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
